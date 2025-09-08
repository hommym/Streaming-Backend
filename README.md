# Streaming-Backend

This project is a robust and scalable backend for a streaming service, built with TypeScript. It provides core functionalities for user authentication, live streaming management, movie information, playlists, and real-time communication via WebSockets.

## Features

*   **User Authentication:** Secure user registration, login, password management (change, reset), and account information updates using JWT for authorization.
*   **Live Streaming:** Management of live streams, including stream creation, viewing, and real-time messaging.
*   **Movie Information:** Storage and retrieval of movie details.
*   **Playlists:** Functionality to create and manage user-defined playlists.
*   **Real-time Communication:** WebSocket server for live chat during streams and other real-time interactions.
*   **File Server:** Dedicated server for serving static files, potentially including video content or user uploads.
*   **Email Service:** Integration for sending transactional emails (e.g., password reset, account verification).
*   **Robust Error Handling:** Centralized HTTP and database exception handling.



## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Streaming-Backend.git
    cd Streaming-Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    *   Ensure you have a MYSQL server running.
    *   Create a database for the project.
    *   Apply the initial database migrations. (Details on how to run migrations would typically be provided here, e.g., `npm run migrate`).

4.  **Environment Variables:**
    Create a `.env` file in the root directory and configure the following (example):
    ```
    PORT=3000
    DATABASE_URL="mysql://user:password@host:port/database"
    JWT_SECRET="your_jwt_secret_key"
    EMAIL_SERVICE_HOST="smtp.example.com"
    EMAIL_SERVICE_PORT=587
    EMAIL_SERVICE_USER="your_email@example.com"
    EMAIL_SERVICE_PASS="your_email_password"
    ```

## Usage

1.  **Build the project:**
    ```bash
    npm run build
    ```

2.  **Start the server:**
    ```bash
    npm start
    ```
    The main server will typically run on `http://localhost:3000` (or the port specified in your `.env` file).


(Refer to `src/database/migrations/initial_tables.sql` for the exact schema.)
