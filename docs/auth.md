# Authentication Guide

## Overview

This document provides an overview of the authentication system implemented in the application. It explains how the authentication flow works between the frontend and backend, and provides guidance on how to manage authentication in your development and production environments.

## Contents

- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [Frontend Implementation](#frontend-implementation)
- [Backend Implementation](#backend-implementation)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)

## Authentication Flow

The application uses JSON Web Tokens (JWT) for authentication, with access tokens and refresh tokens. The flow is as follows:

1. **User Registration**: A new user registers by providing their name, email, and password.
2. **User Login**: The user logs in with their email and password.
3. **Token Generation**: Upon successful authentication, the backend generates an access token and a refresh token.
4. **Token Storage**: The access token is stored in the frontend's state (and optionally in `localStorage`), while the refresh token is sent as an HTTP-only cookie.
5. **Authenticated Requests**: The frontend includes the access token in the `Authorization` header of subsequent API requests to protected routes.
6. **Token Refresh**: When the access token expires, the frontend can request a new access token using the refresh token.

## Frontend Implementation

### Authentication Context (`AuthContext.tsx`)

The `AuthContext` provides authentication state and methods to the application:

- **State**:
  - `isAuthenticated`: Indicates if the user is authenticated.
  - `accessToken`: Stores the JWT access token.

- **Methods**:
  - `login(email, password)`: Authenticates the user and updates the state.
  - `logout()`: Clears authentication state and logs out the user.

### Usage

- Wrap the application with `AuthProvider` in `app/layout.tsx`.
- Use the `useAuth` hook to access authentication state and methods in components.
- Protect routes using a `ProtectedRoute` component that redirects unauthenticated users to the login page.

### Authentication Form (`AuthenticationForm.tsx`)

- Handles user login and registration.
- Validates user input and displays error messages.
- Communicates with the backend API for authentication.

## Backend Implementation

### Routes

- **`POST /api/users`**: User registration.
- **`POST /api/auth/login`**: User login.
- **`POST /api/auth/logout`**: User logout.

### Controllers

- **`handleRegister`**:
  - Validates input.
  - Checks if the user already exists.
  - Hashes the password and creates a new user in the database.
- **`handleLogin`**:
  - Validates input.
  - Authenticates the user.
  - Generates access and refresh tokens.
  - Sends the access token in the response and the refresh token as an HTTP-only cookie.
- **`handleLogout`**:
  - Clears the refresh token cookie.

### Middleware

- **`verifyJWT`**: Protects routes by verifying the access token.

## Security Considerations

- **Token Storage**:
  - For development, tokens are stored in `localStorage` for simplicity.
  - For production, store tokens securely using HTTP-only cookies to prevent XSS attacks.

- **Password Security**:
  - Passwords are hashed using `bcrypt` before storing in the database.

- **CORS Configuration**:
  - The backend is configured to accept requests from the frontend origin.

## Future Improvements

- **Implement Token Refresh Mechanism**:
  - Automatically refresh access tokens using the refresh token.

- **Use Secure Token Storage**:
  - Transition to using HTTP-only cookies for storing tokens in production.

- **Enhance Error Handling**:
  - Provide more detailed error messages and logging.

- **Input Validation**:
  - Implement comprehensive input validation on both frontend and backend.

## References

- [JWT (JSON Web Tokens)](https://jwt.io/)
- [React Context API](https://reactjs.org/docs/context.html)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)
- [Resource on Implementing Auth in Web Apps](https://thecopenhagenbook.com/)