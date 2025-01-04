
# Chatify

**Chatify** is a real-time messaging app built using the **MERN stack** (MongoDB, Express, React, Node.js) and **Zustand** for state management. It allows users to register, authenticate, chat in real-time, send and receive messages, and manage their profiles. The app also features socket-based communication for online status and real-time updates. 

This project demonstrates an end-to-end chat solution with key functionalities like authentication, profile management, message sending, and live notifications using WebSockets.

---

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Features](#features)
3. [Installation Instructions](#installation-instructions)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Routes and API Endpoints](#routes-and-api-endpoints)
7. [State Management](#state-management)
8. [Real-Time Communication](#real-time-communication)
9. [File Uploads](#file-uploads)
10. [License](#license)

---

## Technologies Used

- **Frontend**: React, Zustand, React Router DOM, Tailwind CSS, lucide-react, React Hot Toast
- **Backend**: Node.js, Express, MongoDB, Socket.IO, dotenv, cookie-parser, CORS, multer
- **Cloud**: Cloudinary (for image uploads)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.IO
- **State Management**: Zustand

---

## Features

### 1. **User Authentication**
   - **Sign Up**: New users can sign up by providing necessary details.
   - **Login/Sign In**: Registered users can log in using their credentials.
   - **Sign Out**: Users can log out from the app, which also clears their session.
   - **Profile Management**: Users can update their profile and upload a profile picture.

### 2. **Real-Time Messaging**
   - **Send/Receive Messages**: Users can send and receive messages instantly.
   - **Delete Messages**: Users can delete individual messages.
   - **Clear Chat**: Option to clear the entire chat history with a specific user.

### 3. **User Status**
   - **Online/Offline Status**: Displays whether the user is online or offline in real-time.
   - **Last Active Time**: Shows the last time the user was active (optional feature, currently in progress).

### 4. **File Uploads**
   - **Image Uploads**: Users can upload and send images along with text messages.
   - **Image Preview**: Users can preview images before sending.

### 5. **Socket.IO Integration**
   - **Real-Time Updates**: Utilizes WebSockets via Socket.IO to handle real-time communication (i.e., when a user sends a message, the recipient sees it immediately).
   - **User Connection Management**: Tracks online users and manages their socket connections.

### 6.  **Themes with Daisy UI**
    **Theme Customization** : Users can switch between different chat themes to personalize the look and feel of the chat interface.
    **Daisy UI Integration**: Daisy UI is used for easily switching themes in the app. Themes are applied dynamically, allowing users to choose from a variety of styles to enhance their chatting experience.
---

## Routes and API Endpoints

### **Auth Routes** (`/api/auth`)

- **POST /signup**: User registration.
- **POST /signin**: User login.
- **POST /signout**: User logout.
- **PUT /update-profile**: Update user profile (protected route).
- **GET /check**: Check if the user is authenticated (protected route).
- **PUT /update-account**: Update user account details (protected route).
- **DELETE /delete-account**: Delete the user account (protected route).

### **Message Routes** (`/api/messages`)

- **GET /users**: Get a list of users for sidebar (protected route).
- **GET /:id**: Get messages between the authenticated user and another user (protected route).
- **POST /send/:id**: Send a new message to a specific user (protected route).
- **DELETE /clearChat/:id**: Clear chat with a specific user (protected route).
- **DELETE /deleteMessage/:messageId**: Delete a specific message (protected route).

---

## State Management

### Zustand
Zustand is used to manage the application state for authentication (`authStore`) and real-time updates for users and messages (`chatStore`). 

- **Authentication State**: Stores user details, authentication status, and loading state.
- **Real-Time Chat State**: Tracks selected user, messages, online status, and chat history.

---

## Real-Time Communication

### Socket.IO Integration
- When a user logs in, a socket connection is established, and the server listens for new messages and updates.
- The `userSocketMap` is used to track connected users and their socket IDs.
- Real-time updates, such as incoming messages, online status changes, and new connections, are broadcasted to all connected clients.

---

## File Uploads

**Cloudinary** is used to store and serve user profile images. Users can upload profile pictures when signing up or updating their profile.

- **Multer** middleware is used for handling file uploads in the backend.
- **Cloudinary API** is used to upload images and get the public URL for displaying in the frontend.

---

## License

This project is open-source and available under the MIT License.

---

If you have any questions, feel free to contact me via GitHub or email.

