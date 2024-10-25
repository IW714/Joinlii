# Backend Setup Guide

## Overview

This document provides instructions on how to set up and run the backend server locally for development purposes.

## Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [Testing the API](#testing-the-api)

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- A relational database (e.g., PostgreSQL, MySQL)
- Prisma CLI (`npm install -g prisma`)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/IW714/Joinlii.git
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the `backend` directory with the following content:

    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    DATABASE_URL=your_database_connection_string

- Replace `your_access_token_secret` and `your_refresh_token_secret` with secure random strings.
- Replace `your_database_connection_string` with your actual database connection string.

## Database Setup

1. **Configure Prisma**:

   - Edit `prisma/schema.prisma` to define your database models.

2. **Run Prisma Migrations**:
    ```bash
      npx prisma migrate dev --name init
    ```

3. **Generate Prisma Client**:
    ```bash
      npx prisma generate
    ```

## Running the Server

- **Start the Server**:
    ```bash
      npm start
    ```

- The server should be running on `http://localhost:3001`.

## Testing the API

- Use **Postman** or another API client to test the endpoints.
- **Available Endpoints**:
  - `POST /api/users` - Register a new user.
  - `POST /api/auth/login` - Authenticate a user.
  - `POST /api/auth/logout` - Log out a user.
  - **Protected Routes** (require JWT):
    - `GET /api/protected` - Example protected route.

## References

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Introduction](https://jwt.io/introduction/)
