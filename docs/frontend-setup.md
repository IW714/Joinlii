# Frontend Setup Guide

## Overview

This document provides instructions on how to set up and run the frontend application locally for development purposes.

## Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Notes](#notes)
- [References](#references)

## Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)

## Installation

1. **Clone the Repository**:

   Run the following commands:

      git clone https://github.com/your-repo.git
      cd your-repo/frontend

2. **Install Dependencies**:
    ```bash
      npm install
    ```

## Running the Application

- **Start the Development Server**:
    ```bash
      npm run dev
    ```

- The application should be running on `http://localhost:3000`.

## Available Scripts

- **`npm run dev`**: Runs the app in development mode.
- **`npm run build`**: Builds the app for production.
- **`npm run start`**: Starts the production server after building.

## Notes

- Ensure that the backend server is running to handle API requests.
- The application uses **Next.js** with the **App Router** (`app/` directory).
- The UI components are built with **Mantine**.

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantine Documentation](https://mantine.dev/)
- [React Documentation](https://reactjs.org/)
