# 🧱 The Block Page - Backend Architecture

> **A full-stack social media application (01Blog) built with Spring Boot.**

**The Block Page** is a platform where users manage their own "Block" (Profile), post multimedia content, subscribe to others, and interact via likes and comments. It features a robust Role-Based Access Control (RBAC) system with a dedicated Admin Dashboard for moderation.

---

## 🚀 Technologies Used

### Backend
* **Framework:** Spring Boot 3.x
* **Language:** Java 17+
* **Security:** Spring Security & JWT (JSON Web Tokens)
* **Database:** PostgreSQL (Recommended) or MySQL
* **ORM:** Spring Data JPA (Hibernate)
* **Build Tool:** Maven
* **Storage:** Local File System (Dev) / AWS S3 (Prod)

### Frontend
* **Framework:** Angular (Material) or React (Bootstrap)
* **HTTP Client:** Axios / RxJS

---

## 🏗️ System Architecture

### 1. Database Schema
The application uses a relational database with the following core entities:

| Entity | Description | Relationships |
| :--- | :--- | :--- |
| **User** | Stores login credentials, role (USER/ADMIN), and status (Active/Banned). | One-to-Many (Posts, Comments, Likes) |
| **Post** | Content created by users containing text and media URLs. | One-to-Many (Comments, Likes) |
| **Subscription** | Tracks who follows whom. | Many-to-Many (User <-> User) |
| **Comment** | Text interactions on specific posts. | Many-to-One (User, Post) |
| **Like** | Binary interaction on posts. | Many-to-One (User, Post) |
| **Report** | Moderation tickets created by users against others. | Many-to-One (Reporter, Reported User) |
| **Notification** | Updates for users (new posts, etc.). | Many-to-One (Recipient) |

### 2. Project Directory Structure
The code is organized using the **Layered Architecture** pattern:

```text
com.project.block
├── config/             # Security, CORS, & Swagger Configuration
├── controller/         # REST Controllers (API Endpoints)
├── dto/                # Data Transfer Objects (Request/Response models)
├── entity/             # JPA Entities (Database Tables)
├── repository/         # Spring Data JPA Interfaces
├── security/           # JWT Filters, UserDetailsServiceImpl
├── service/            # Business Logic Layer (Interfaces & Impl)
├── util/               # Helper classes (File storage, Constants)
└── BlockApplication.java