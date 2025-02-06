# CargoTrack: Cargo Booking and Management System

## Overview
CargoTrack is a comprehensive Cargo Booking and Management System developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The platform enables users to book cargo space on available containers, track shipments in real time, and provides an admin panel for efficient container and cargo management. The system ensures secure user interactions through multi-step authentication, middleware-based authorization, and seamless container allocation.

---

## Technologies Used

### **Frontend**
- **React.js (18.2.0):** Provides a responsive and dynamic user interface for cargo booking, payment processing, and profile management.
- **Material UI (5.15.9):** Enhances the UI with modern, pre-built React components.
- **Framer Motion (11.0.3):** Enables smooth animations and transitions for an engaging user experience.
- **React-Toastify (10.0.4):** Displays real-time notifications such as booking confirmations and system alerts.

### **Backend**
- **Node.js (20.11.0):** Executes server-side logic, handling authentication, database management, and API routing.
- **Express.js (4.18.2):** Manages HTTP requests, routing, and RESTful API endpoints.
- **MongoDB & Mongoose:** Provides a NoSQL database for efficient storage of bookings, users, containers, and transactions.
- **JWT (JSON Web Tokens):** Ensures secure authentication and authorization through token-based access.
- **Nodemailer (6.9.4):** Facilitates OTP-based email authentication.
- **Bcrypt.js (2.4.3):** Encrypts passwords for secure storage.
- **CORS (2.8.5):** Enables secure cross-origin communication between frontend and backend.
- **Dotenv (16.3.1):** Manages environment variables for security-sensitive configurations.
- **Nodemon (3.0.1):** Enhances backend development efficiency by enabling live server reloads.

---

## Key Functionalities

### **1. Admin Dashboard**
The admin panel provides comprehensive container management, booking oversight, and utilization tracking.

#### **Admin API Endpoints:**
- `POST /cargo/admin/login` – Admin login with OTP-based authentication.
- `POST /cargo/admin/register` – Admin registration with secure credentials.
- `POST /cargo/admin/container` – Add a new container with route details and pricing.
- `GET /cargo/admin/:adminId/containers` – Retrieve the list of containers managed by an admin.
- `POST /cargo/admin/containerupdate` – Update container details such as location and capacity.

### **2. User Booking System**
Users can book cargo space, track shipments, and manage their bookings securely.

#### **User API Endpoints:**
- `POST /register` – User registration with email verification.
- `POST /login` – User login with OTP authentication.
- `POST /verify-otp` – OTP verification for secure login.
- `POST /cargo/booking` – Submit a cargo booking request with parcel dimensions and route details.
- `POST /cargo/booking/payment` – Securely process payments and confirm bookings.
- `GET /cargo/booking` – Retrieve past bookings and track active shipments.

---

## Database Schema and Relationships
CargoTrack employs a structured schema design to ensure efficient management of bookings, containers, and user operations.

### **1. Users**
- **Fields:** `name`, `email`, `phone`, `password`, `bookings` (array of booking references).
- **Relationships:** Users can have multiple bookings linked to their profile.

### **2. Bookings**
- **Fields:** `from`, `to`, `height`, `width`, `breadth`, `cost`, `destinedContainer`, `status`.
- **Relationships:** Each booking is associated with a user and, if confirmed, linked to a container.

### **3. Cargo Items**
- **Fields:** `length`, `breadth`, `height`, `from`, `to`.
- **Relationships:** Cargo items are stored within containers and validated against space constraints.

### **4. Containers**
- **Fields:** `length`, `breadth`, `height`, `from`, `to`, `availableFrom`, `availableUntil`, `cargoItems`.
- **Relationships:** Containers store multiple cargo items and are managed by admins.

### **5. Admins**
- **Fields:** `name`, `email`, `phone`, `password`, `containers`.
- **Relationships:** Admins oversee multiple containers and manage bookings.

---

## Data Flow and Storage

### **1. User Registration & Booking Process**
- User registers, and credentials are securely stored.
- On booking, cargo details are saved, and an available container is allocated based on the route and dimensions.

### **2. Container Allocation & Management**
- The backend matches bookings with suitable containers.
- Container space utilization is tracked, preventing overbooking.

### **3. Admin Operations**
- Admins create and manage containers, ensuring efficient allocation.
- Containers and bookings are monitored using real-time tracking and percentage utilization calculations.

---

## Setup Instructions

### **1. Clone the Repository**
```bash
# Clone backend and frontend repositories
git clone <backend-repo-url>
git clone <frontend-repo-url>
```

### **2. Install Dependencies**
For the backend:
```bash
cd backend
npm install
```
For the frontend:
```bash
cd frontend
npm install
```

### **3. Environment Variables Configuration**
Create a `.env` file in the backend directory and define the following:
```plaintext
MONGO_URI=mongodb://localhost:27017/cargo-track
JWT_SECRET=your-jwt-secret
NODEMAILER_EMAIL=your-email@example.com
NODEMAILER_PASSWORD=your-email-password
```

### **4. Running the Project**
To start the backend and frontend in development mode:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### **5. Production Deployment**
For production deployment:
```bash
# Build frontend for production
cd frontend
npm run build
```
Consider using **Docker** for containerized deployment.

---

## Conclusion
CargoTrack offers a robust solution for cargo booking and shipment management, ensuring secure, scalable, and efficient operations. Its modular architecture enables seamless user interactions, real-time tracking, and optimized resource management. Future enhancements could include AI-driven container allocation, predictive ETA calculations, and blockchain-based shipment security.

For contributions or inquiries, refer to the repository documentation or contact the development team.

