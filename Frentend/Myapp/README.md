# 01BLOG

## Project Structure

The project is organized into the following main directories:

-   **`src/`**: Contains the main source code of the application.
    -   **`app/`**: The root component of the application.
        -   **`core/`**: Contains core features like services, models, guards, and interceptors.
            -   **`guards/`**: Route guards for authentication and authorization.
            -   **`interceptors/`**: HTTP interceptors.
            -   **`models/`**: Data models used in the application.
            -   **`services/`**: Services that provide specific functionalities like authentication, post management, etc.
        -   **`features/`**: Contains the different features of the application, organized by domain.
            -   **`admin/`**: Components related to the admin dashboard.
            -   **`auth/`**: Components for user authentication (login, register).
            -   **`home/`**: The home page and post feed.
            -   **`user-block/`**: Components related to user profiles.
        -   **`layout/`**: Components for the general layout of the application, like navbar and footer.
        -   **`shared/`**: Contains shared components, pipes, and directives.
    -   **`public/`**: public assets.
-   **`dist/`**: for the build output.
-   **`node_modules/`**: Project dependencies.
-   **`angular.json`**: Angular CLI configuration file.
-   **`package.json`**: Project dependencies and scripts.
-   **`tsconfig.json`**: TypeScript compiler configuration.