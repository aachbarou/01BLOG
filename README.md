# 01BLOG — Full-Stack Blog Platform

A modern, full-stack blog platform built with **Angular 19** (frontend) and **Spring Boot 3** (backend), featuring user authentication, post creation with media, social interactions, admin moderation, and notifications.

---

## 🏗 Architecture Overview

```mermaid
graph TB
    subgraph Frontend ["🖥 Frontend — Angular 19"]
        A[Browser Client]
        B[Angular SSR / CSR]
    end

    subgraph Backend ["⚙️ Backend — Spring Boot 3"]
        C[REST API Controllers]
        D[Service Layer]
        E[JPA Repositories]
    end

    subgraph Database ["🗄 Database"]
        F[(MySQL / MariaDB)]
    end

    subgraph Storage ["📁 File Storage"]
        G[Local Filesystem]
    end

    A -->|HTTP / JWT| C
    B -->|SSR Render| A
    C --> D
    D --> E
    E --> F
    C -->|File Upload / Serve| G
```

---

## 📂 Project Structure

```
01BLOG/
├── Backend/backendblock/      ← Spring Boot API
│   └── src/main/java/com/project/block/
│       ├── Controllers/       ← REST endpoints
│       ├── entity/            ← JPA entities
│       ├── dto/               ← Data transfer objects
│       ├── models/            ← Business logic services
│       ├── repository/        ← Database repositories
│       ├── config/            ← Security & CORS config
│       └── filters/           ← JWT authentication filter
│
├── Frentend/Myapp/            ← Angular 19 app
│   └── src/app/
│       ├── core/              ← Services, guards, models
│       ├── features/          ← Feature modules (pages)
│       ├── shared/            ← Reusable components
│       └── layout/            ← Navbar, footer
│
└── README.md                  ← This file
```

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as AuthController
    participant S as UserService
    participant DB as Database

    C->>A: POST /Auth/Register {email, password, username}
    A->>S: createUser()
    S->>DB: Save user
    A-->>C: 201 Created

    C->>A: POST /Auth/Login {email, password}
    A->>S: loginUser() + GenerateNewToken()
    A-->>C: 200 {data: {token: "JWT..."}}

    Note over C: Token stored in localStorage

    C->>A: GET /api/posts (Authorization: Bearer JWT)
    Note over A: JwtFilter validates token
    A-->>C: 200 {data: [...posts]}
```

---

## 📡 API Endpoints Summary

### Auth (`/Auth`)
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/Register` | Register new user | 201, 400 |
| POST | `/Login` | Login & get JWT | 200, 400, 403, 500 |

### Users (`/api/users`)
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/me` | Current user profile | 200, 401, 500 |
| GET | `/{id}` | User profile by ID | 200, 404, 500 |
| PUT | `/update` | Update profile | 200, 400, 500 |
| POST | `/{id}/follow` | Toggle follow | 200, 400 |

### Posts (`/api/posts`)
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/` | All visible posts | 200, 500 |
| GET | `/{id}` | Single post (visibility enforced) | 200, 403, 404, 500 |
| GET | `/User/{userId}` | Posts by user | 200, 500 |
| POST | `/` | Create post | 201, 400, 500 |
| PUT | `/{id}` | Update post | 200, 400, 403, 500 |
| DELETE | `/{id}` | Delete post | 200, 403, 404, 500 |
| POST | `/{id}/like` | Toggle like | 200, 500 |

### Comments (`/api/comments`)
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/post/{postId}` | Get comments for post | 200, 500 |
| POST | `/post/{postId}` | Add comment | 201, 400, 404 |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/` | Get all notifications | 200, 500 |
| PUT | `/{id}/read` | Mark as read | 200, 500 |
| PUT | `/read-all` | Mark all as read | 200, 500 |

### Reports (`/api/reports`)
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/` | Submit report | 201, 400, 500 |

### Admin (`/api/admin`) — requires ADMIN role
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/users` | All users | 200, 500 |
| POST | `/users/{id}/ban` | Toggle ban | 200, 400, 404, 500 |
| DELETE | `/users/{id}` | Delete user | 200, 400, 500 |
| GET | `/posts` | All posts | 200, 500 |
| PUT | `/posts/{id}/status` | Change post status | 200, 500 |
| DELETE | `/posts/{id}` | Delete post | 200, 500 |
| GET | `/reports` | All reports (enriched) | 200, 500 |
| DELETE | `/reports/{id}` | Resolve report | 200, 500 |

### Other
| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/token/validate` | Validate JWT | 200, 401 |
| GET | `/files/{filename}` | Serve uploaded file | 200, 404, 500 |

---

## 🗃 Database Schema

```mermaid
erDiagram
    USERS {
        Long user_id PK
        String username
        String email
        String password
        String role
        String user_avatar
        String status
        Boolean banned
    }

    POSTS {
        Long id PK
        String title
        String content
        String media_url
        String status
        Int likes
        Long user_id FK
        DateTime timestamp
    }

    COMMENTS {
        Long id PK
        String content
        Long user_id FK
        Long post_id FK
        DateTime timestamp
    }

    POST_LIKES {
        Long id PK
        Long user_id FK
        Long post_id FK
    }

    SUBSCRIPTIONS {
        Long id PK
        Long follower_id FK
        Long followed_id FK
    }

    REPORTS {
        Long id PK
        String type
        String reason
        String reporter
        Long targetId
        String status
        DateTime timestamp
    }

    NOTIFICATIONS {
        Long id PK
        Long sender_id FK
        Long recipient_id FK
        String text
        String type
        Boolean is_read
        DateTime created_at
    }

    TOKENS {
        Long id PK
        String token
        Boolean is_logged_out
        Long user_id FK
    }

    USERS ||--o{ POSTS : creates
    USERS ||--o{ COMMENTS : writes
    POSTS ||--o{ COMMENTS : has
    USERS ||--o{ POST_LIKES : gives
    POSTS ||--o{ POST_LIKES : receives
    USERS ||--o{ SUBSCRIPTIONS : follows
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ TOKENS : has
    USERS ||--o{ REPORTS : submits
```

---

## 🚀 Quick Start

### Prerequisites
- **Java 21** + Maven
- **Node.js 18+** + npm
- **MySQL / MariaDB**

### Backend
```bash
cd Backend/backendblock
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd Frentend/Myapp
npm install
ng serve
# Runs on http://localhost:4200
```

---

## 🔒 Security
- JWT-based authentication via `JwtFilter`
- Role-based access control (`USER`, `ADMIN`)
- Admin endpoints protected with `@PreAuthorize("hasRole('ADMIN')")`
- Token validation on every authenticated request
- Password encryption via BCrypt
