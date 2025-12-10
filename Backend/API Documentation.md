# 📡 API Documentation

**Base URL:** `http://localhost:8080/api`
**Content-Type:** `application/json` (unless specified otherwise)

---

## 1. Authentication
*Access: Public*

### Register a User
* **Endpoint:** `POST /auth/register`
* **Description:** Creates a new user account. default role is `USER`.
* **Request Body:**
    ```json
    {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "securePassword123"
    }
    ```
* **Response (201 Created):**
    ```json
    {
      "message": "User registered successfully"
    }
    ```

### Login
* **Endpoint:** `POST /auth/login`
* **Description:** Authenticates credentials and returns a JWT.
* **Request Body:**
    ```json
    {
      "username": "john_doe",
      "password": "securePassword123"
    }
    ```
* **Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2hu...",
      "type": "Bearer",
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "roles": ["ROLE_USER"]
    }
    ```

---

## 2. User Profiles ("The Block")
*Access: Authenticated Users*

### Get User Block
* **Endpoint:** `GET /users/{id}`
* **Description:** detailed profile of a specific user including their latest posts.
* **Response:**
    ```json
    {
      "id": 2,
      "username": "jane_smith",
      "postCount": 15,
      "followerCount": 120,
      "posts": [ ...list of post objects... ]
    }
    ```

### Subscribe to User
* **Endpoint:** `POST /users/{id}/subscribe`
* **Description:** Follows the user with the given ID.
* **Response:**
    ```json
    { "message": "Subscribed successfully" }
    ```

### Unsubscribe
* **Endpoint:** `DELETE /users/{id}/subscribe`
* **Description:** Unfollows the user.

---

## 3. Posts & Feed
*Access: Authenticated Users*

### Create Post
* **Endpoint:** `POST /posts`
* **Header:** `Content-Type: multipart/form-data`
* **Parameters:**
    * `file`: (Binary File) - The image or video.
    * `description`: (String) - Text content of the post.
* **Response (201 Created):**
    ```json
    {
      "id": 45,
      "description": "My vacation photo!",
      "mediaUrl": "/uploads/img_45.jpg",
      "timestamp": "2023-10-10T12:00:00"
    }
    ```

### Get Feed
* **Endpoint:** `GET /posts/feed`
* **Query Params:** `?page=0&size=10`
* **Description:** Returns posts from *only* the users you follow.

### Like Post
* **Endpoint:** `POST /posts/{postId}/like`
* **Description:** Toggles the like status (Like if not liked, Unlike if already liked).

### Add Comment
* **Endpoint:** `POST /posts/{postId}/comments`
* **Request Body:**
    ```json
    {
      "content": "This is an amazing shot!"
    }
    ```

---

## 4. Notifications
*Access: Authenticated Users*

### Get Notifications
* **Endpoint:** `GET /notifications`
* **Response:**
    ```json
    [
      {
        "id": 101,
        "message": "Jane liked your post",
        "read": false,
        "createdAt": "..."
      }
    ]
    ```

### Mark Read
* **Endpoint:** `PUT /notifications/{id}/read`

---

## 5. Reports (Moderation)
*Access: Authenticated Users (to Create), Admin (to View)*

### Report a User
* **Endpoint:** `POST /reports`
* **Request Body:**
    ```json
    {
      "reportedUserId": 5,
      "reason": "Harassment and offensive language"
    }
    ```

---

## 6. Admin Dashboard
*Access: `ROLE_ADMIN` Only*

### Get All Users
* **Endpoint:** `GET /admin/users`
* **Response:** List of all users with status (Active/Banned).

### Ban User
* **Endpoint:** `PUT /admin/users/{userId}/ban`
* **Request Body:**
    ```json
    {
      "isBanned": true
    }
    ```

### View Reports
* **Endpoint:** `GET /admin/reports`
* **Description:** Lists all unresolved reports.

### Resolve Report
* **Endpoint:** `DELETE /admin/reports/{reportId}`
* **Description:** Deletes the report (acknowledging it has been handled).