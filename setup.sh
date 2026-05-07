#!/bin/bash
# ============================================================
#  01BLOG — Project Setup & Run Script
#  Spring Boot 3 (Backend) + Angular 21 (Frontend) + PostgreSQL
# ============================================================

set -e

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ── Project Paths ──
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/Backend/backendblock"
FRONTEND_DIR="$ROOT_DIR/Frentend/Myapp"
PROPS_FILE="$BACKEND_DIR/src/main/resources/application.properties"
PROPS_EXAMPLE="$BACKEND_DIR/src/main/resources/application.properties.example"

# ── Default Database Config ──
DB_NAME="${DB_NAME:-blogdb}"
DB_USER="${DB_USER:-bloguser}"
DB_PASS="${DB_PASS:-blogpass}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKEND_PORT="${BACKEND_PORT:-8080}"
FRONTEND_PORT="${FRONTEND_PORT:-4200}"

# ============================================================
#  Helper Functions
# ============================================================

print_banner() {
    echo ""
    echo -e "${CYAN}${BOLD}"
    echo "  ╔══════════════════════════════════════════════╗"
    echo "  ║          01BLOG — Project Setup              ║"
    echo "  ║    Spring Boot 3 + Angular 21 + PostgreSQL   ║"
    echo "  ╚══════════════════════════════════════════════╝"
    echo -e "${NC}"
}

log_info()    { echo -e "${CYAN}[INFO]${NC}    $1"; }
log_success() { echo -e "${GREEN}[✔]${NC}      $1"; }
log_warn()    { echo -e "${YELLOW}[⚠]${NC}      $1"; }
log_error()   { echo -e "${RED}[✘]${NC}      $1"; }
log_step()    { echo -e "\n${BOLD}${CYAN}━━━ $1 ━━━${NC}"; }

# ============================================================
#  Step 1: Check Prerequisites
# ============================================================

check_prerequisites() {
    log_step "Step 1/6: Checking Prerequisites"

    local missing=0

    # Java
    if command -v java &>/dev/null; then
        local java_ver
        java_ver=$(java -version 2>&1 | head -1)
        log_success "Java found: $java_ver"
    else
        log_error "Java not found. Install JDK 17+ (e.g., sudo apt install openjdk-17-jdk)"
        missing=1
    fi

    # Maven (system or wrapper)
    if command -v mvn &>/dev/null; then
        log_success "Maven found: $(mvn --version 2>&1 | head -1)"
    elif [ -f "$BACKEND_DIR/mvnw" ]; then
        log_warn "Maven not installed system-wide — will use Maven Wrapper (./mvnw)"
    else
        log_error "Maven not found and no Maven wrapper available."
        missing=1
    fi

    # Node.js
    if command -v node &>/dev/null; then
        log_success "Node.js found: $(node --version)"
    else
        log_error "Node.js not found. Install Node.js 18+ (https://nodejs.org)"
        missing=1
    fi

    # npm
    if command -v npm &>/dev/null; then
        log_success "npm found: $(npm --version)"
    else
        log_error "npm not found."
        missing=1
    fi

    # Docker
    if command -v docker &>/dev/null; then
        log_success "Docker found: $(docker --version)"
    else
        log_error "Docker not found. Install Docker: https://docs.docker.com/engine/install/"
        missing=1
    fi

    if [ $missing -ne 0 ]; then
        log_error "Missing prerequisites. Please install them and re-run this script."
        exit 1
    fi
}

# ============================================================
#  Step 2: Setup PostgreSQL Database (Docker)
# ============================================================

DB_CONTAINER_NAME="blog_postgres"

setup_database() {
    log_step "Step 2/6: Setting Up PostgreSQL Database (Docker)"

    # Check if container already exists
    if docker ps -a --format '{{.Names}}' | grep -q "^${DB_CONTAINER_NAME}$"; then
        # Container exists — check if it's running
        if docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER_NAME}$"; then
            log_success "PostgreSQL container '${DB_CONTAINER_NAME}' is already running"
        else
            log_info "Starting existing PostgreSQL container..."
            docker start "$DB_CONTAINER_NAME"
            log_success "PostgreSQL container started"
        fi
    else
        # Create and start a new container
        log_info "Creating PostgreSQL container '${DB_CONTAINER_NAME}'..."
        docker run -d \
            --name "$DB_CONTAINER_NAME" \
            -e POSTGRES_DB="$DB_NAME" \
            -e POSTGRES_USER="$DB_USER" \
            -e POSTGRES_PASSWORD="$DB_PASS" \
            -p "${DB_PORT}:5432" \
            -v "blog_pgdata:/var/lib/postgresql/data" \
            --restart unless-stopped \
            postgres:16-alpine
        log_success "PostgreSQL container created"
    fi

    # Wait for PostgreSQL to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    local retries=0
    while ! docker exec "$DB_CONTAINER_NAME" pg_isready -U "$DB_USER" -d "$DB_NAME" &>/dev/null; do
        sleep 1
        retries=$((retries + 1))
        if [ $retries -ge 30 ]; then
            log_error "PostgreSQL did not become ready in 30s. Check: docker logs $DB_CONTAINER_NAME"
            exit 1
        fi
    done
    log_success "PostgreSQL is ready on port ${DB_PORT}"
    log_info "  Container: ${DB_CONTAINER_NAME}"
    log_info "  Database:  ${DB_NAME}"
    log_info "  User:      ${DB_USER}"
}

# ============================================================
#  Step 3: Generate application.properties
# ============================================================

generate_properties() {
    log_step "Step 3/6: Generating application.properties"

    if [ -f "$PROPS_FILE" ]; then
        log_warn "application.properties already exists — backing up to application.properties.bak"
        cp "$PROPS_FILE" "$PROPS_FILE.bak"
    fi

    cat > "$PROPS_FILE" <<EOF
# ============================================
# 01BLOG — Spring Boot Configuration
# AUTO-GENERATED by setup.sh — DO NOT COMMIT
# ============================================

# Database
spring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# File Upload Configuration
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB
file.upload-dir=Uploads

# Server
server.port=${BACKEND_PORT}

# Shared File Endpoint Variable
app.file-base-url=http://localhost:${BACKEND_PORT}/files/
EOF

    log_success "application.properties generated at:"
    log_info "  $PROPS_FILE"
    log_warn "This file is in .gitignore and will NOT be committed."
}

# ============================================================
#  Step 4: Create Upload Directory
# ============================================================

create_upload_dir() {
    log_step "Step 4/6: Creating Upload Directory"

    local upload_dir="$BACKEND_DIR/Uploads"
    mkdir -p "$upload_dir"
    log_success "Upload directory ready: $upload_dir"
}

# ============================================================
#  Step 5: Install Frontend Dependencies
# ============================================================

install_frontend() {
    log_step "Step 5/6: Installing Frontend Dependencies"

    if [ ! -d "$FRONTEND_DIR/node_modules" ] || [ ! -d "$FRONTEND_DIR/node_modules/@angular" ]; then
        log_info "Running npm install in $FRONTEND_DIR ..."
        (cd "$FRONTEND_DIR" && npm install)
        log_success "Frontend dependencies installed"
    else
        log_success "Frontend dependencies already installed (node_modules exists)"
    fi

    # Install Angular CLI globally if not present
    if ! command -v ng &>/dev/null && ! npx ng version &>/dev/null 2>&1; then
        log_info "Installing Angular CLI globally..."
        npm install -g @angular/cli
        log_success "Angular CLI installed"
    else
        log_success "Angular CLI is available"
    fi
}

# ============================================================
#  Step 6: Run the Project
# ============================================================

run_project() {
    log_step "Step 6/6: Starting the Project"

    # Determine Maven command
    local mvn_cmd="mvn"
    if ! command -v mvn &>/dev/null; then
        mvn_cmd="$BACKEND_DIR/mvnw"
        chmod +x "$mvn_cmd"
    fi

    echo ""
    log_info "Starting Backend (Spring Boot) on port ${BACKEND_PORT}..."
    (cd "$BACKEND_DIR" && $mvn_cmd spring-boot:run) &
    BACKEND_PID=$!

    # Wait for backend to be ready
    log_info "Waiting for backend to start..."
    local retries=0
    while ! curl -s "http://localhost:${BACKEND_PORT}" >/dev/null 2>&1; do
        sleep 3
        retries=$((retries + 1))
        if [ $retries -ge 40 ]; then
            log_warn "Backend is taking longer than expected (120s). It may still be downloading Maven dependencies."
            log_info "Check the backend logs above for progress."
            break
        fi
    done

    if curl -s "http://localhost:${BACKEND_PORT}" >/dev/null 2>&1; then
        log_success "Backend is running at http://localhost:${BACKEND_PORT}"
    fi

    echo ""
    log_info "Starting Frontend (Angular) on port ${FRONTEND_PORT}..."
    (cd "$FRONTEND_DIR" && npx ng serve --port "$FRONTEND_PORT" --open) &
    FRONTEND_PID=$!

    echo ""
    echo -e "${GREEN}${BOLD}"
    echo "  ╔══════════════════════════════════════════════╗"
    echo "  ║            01BLOG is Running! 🚀             ║"
    echo "  ╠══════════════════════════════════════════════╣"
    echo "  ║  Backend:   http://localhost:${BACKEND_PORT}            ║"
    echo "  ║  Frontend:  http://localhost:${FRONTEND_PORT}            ║"
    echo "  ║                                              ║"
    echo "  ║  Press Ctrl+C to stop both servers            ║"
    echo "  ╚══════════════════════════════════════════════╝"
    echo -e "${NC}"

    # Handle graceful shutdown
    trap cleanup SIGINT SIGTERM
    wait
}

# ============================================================
#  Cleanup on exit
# ============================================================

cleanup() {
    echo ""
    log_info "Shutting down..."
    [ -n "$BACKEND_PID" ]  && kill "$BACKEND_PID"  2>/dev/null && log_success "Backend stopped"
    [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null && log_success "Frontend stopped"
    exit 0
}

# ============================================================
#  Seed Data (optional)
# ============================================================

seed_database() {
    log_step "Seeding Database with Sample Data"

    local seed_file="$ROOT_DIR/seed_posts.sql"
    if [ -f "$seed_file" ]; then
        log_info "Running seed_posts.sql via Docker..."
        docker cp "$seed_file" "${DB_CONTAINER_NAME}:/tmp/seed_posts.sql"
        docker exec "$DB_CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -f /tmp/seed_posts.sql 2>/dev/null && \
            log_success "Seed data inserted" || \
            log_warn "Seed failed (tables may not exist yet — run seed after first backend start)"
    else
        log_warn "No seed file found at $seed_file"
    fi
}

# ============================================================
#  Usage / Help
# ============================================================

show_help() {
    echo ""
    echo -e "${BOLD}Usage:${NC} ./setup.sh [COMMAND]"
    echo ""
    echo -e "${BOLD}Commands:${NC}"
    echo "  setup       Full setup: prerequisites, DB, config, dependencies (default)"
    echo "  run         Start both backend and frontend servers"
    echo "  all         Full setup + run (complete first-time setup)"
    echo "  db          Setup database only"
    echo "  config      Generate application.properties only"
    echo "  frontend    Install frontend dependencies only"
    echo "  seed        Seed the database with sample data"
    echo "  help        Show this help message"
    echo ""
    echo -e "${BOLD}Environment Variables:${NC}"
    echo "  DB_NAME       Database name     (default: blogdb)"
    echo "  DB_USER       Database user     (default: bloguser)"
    echo "  DB_PASS       Database password (default: blogpass)"
    echo "  DB_HOST       Database host     (default: localhost)"
    echo "  DB_PORT       Database port     (default: 5432)"
    echo "  BACKEND_PORT  Backend port      (default: 8080)"
    echo "  FRONTEND_PORT Frontend port     (default: 4200)"
    echo ""
    echo -e "${BOLD}Examples:${NC}"
    echo "  ./setup.sh all                              # First-time setup + run"
    echo "  ./setup.sh run                              # Just start the servers"
    echo "  DB_NAME=mydb DB_PASS=secret ./setup.sh all  # Custom DB config"
    echo ""
}

# ============================================================
#  Main Entry Point
# ============================================================

main() {
    print_banner

    local command="${1:-setup}"

    case "$command" in
        setup)
            check_prerequisites
            setup_database
            generate_properties
            create_upload_dir
            install_frontend
            echo ""
            log_success "Setup complete! Run ${BOLD}./setup.sh run${NC} to start the project."
            ;;
        run)
            run_project
            ;;
        all)
            check_prerequisites
            setup_database
            generate_properties
            create_upload_dir
            install_frontend
            run_project
            ;;
        db)
            setup_database
            ;;
        config)
            generate_properties
            ;;
        frontend)
            install_frontend
            ;;
        seed)
            seed_database
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
