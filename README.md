# CargoTrack MERN Website for Cargo Booking and Management

## Overview

CargoTrack is a Cargo Booking and Management System designed using the MERN stack (MongoDB, ExpressJS, ReactJS, and NodeJS). It allows users to book cargo space on available containers and track
their shipments, while also offering an admin panel for managing containers and cargo bookings. The platform ensures secure and efficient user interaction with multi-step authentication, authorization using middleware, 
container management and cargo booking.

---

## **Technologies Used**

### **Frontend**
- **ReactJS 18.2.0**: A powerful frontend library for building dynamic, responsive user interfaces. Used for rendering the booking, payment, and profile pages.
- **Material UI 5.15.9**: A UI framework that provides pre-built React components for building a modern, responsive, and visually appealing interface.
- **Framer Motion 11.0.3**: Used to enhance the UI with smooth animations and transitions.
- **React-Toastify 10.0.4**: For displaying real-time notifications, such as booking confirmations and error messages.

### **Backend**
- **NodeJS 20.11.0**: A JavaScript runtime for executing server-side logic, which facilitates API creation, user authentication, and database management.
- **ExpressJS 4.18.2**: The web framework used for handling HTTP requests and responses, building RESTful APIs, and routing.
- **MongoDB & Mongoose**: MongoDB is used for storing data such as bookings, users, containers, and payments. Mongoose simplifies interaction with MongoDB using schemas and models.
- **JWT (JSON Web Tokens)**: For authentication, where a token is issued after successful user login and stored for further authorization.
- **Nodemailer 6.9.4**: For sending OTPs via email during the login process.
- **Bcryptjs 2.4.3**: Used for securely hashing passwords before storing them in the database.
- **Cors 2.8.5**: Middleware for enabling cross-origin resource sharing to allow frontend and backend to communicate.
- **Dotenv 16.3.1**: For managing environment variables like database URLs and JWT secrets.
- **Nodemon 3.0.1**: Automatically restarts the server during development whenever changes are made to the backend files.

---

## **Key Functionalities**

### 1. **Admin Section**
Admins have the ability to manage containers, view available container space utilization and view bookings through the **Admin Dashboard**. This section is accessible only by admins.

#### Routes:
- `POST /cargo/admin/login`: Admin login endpoint. It requires email and password, and sends an OTP to the registered email. After OTP verification, a JWT token is generated.
- `POST /cargo/admin/register`: Allows admins to register their accounts with email and password.
- `POST /cargo/admin/container`: Admin can add a new container by providing the "from" and "to" locations, dimensions, and cost per cubic foot.
- `GET /cargo/admin/:adminId/containers`: Allows the admin to view a list of containers they have created.
- `POST /cargo/admin/containerupdate`: Admin can update container details (location, dimensions, cost, etc.).

### 2. **User Section**
Normal users can book cargo space in available containers by providing the required details. The platform uses JWT tokens for secure access to the booking process and middleware to authenticate via JWT.

#### Routes:
- `POST /register`: User registration, where the user provides email, password, and other details.
- `POST /login`: User login, which sends an OTP to the registered email, verifies it, and returns a JWT token upon success.
- `POST /verify-otp`: Verifies the OTP sent to the user during login.
- `POST /cargo/booking`: A user can submit a booking request by providing source, destination, parcel dimensions, and other relevant details. The backend checks for available containers on the specified route and assigns a suitable container if available.
- `POST /cargo/booking/payment`: After booking, the user is redirected to the payment page. The payment endpoint finalizes the booking after payment is successful, updating the booking status and linking it with the appropriate container.
- `GET /cargo/booking`: A user can view all their past bookings, regardless of status (pending or confirmed).

---

## Database Structure and Schema Relationships

This section explains the schema structure for the Cargo Booking System and how the entities—users, containers, bookings, and parcels—are related and stored in the MongoDB database. 
The design ensures efficient management of bookings, cargo allocation, and user operations.

---

### **Entities and Relationships**

#### **1. Users**
- **Purpose**: Represents individuals (customers or admins) who interact with the system.
- **Key Fields**:
  - `name`, `email`, `phone`, and `password`: Basic user information.
  - `bookings`: An array of `ObjectId` references to the `bookings` collection.
- **Relations**:
  - Each user can have multiple bookings, represented by the `bookings` array.

#### **2. Bookings**
- **Purpose**: Represents a parcel booking request made by a user.
- **Key Fields**:
  - `from` and `to`: Source and destination cities (validated against a predefined list of cities).
  - `height`, `width`, and `breadth`: Dimensions of the parcel.
  - `description`: Optional details about the parcel.
  - `cost`: Calculated based on the parcel dimensions and the route.
  - `destinedContainer`: An `ObjectId` reference to the container where the parcel is allocated.
  - `status`: Tracks whether the booking is pending, confirmed, or completed.
- **Relations**:
  - Linked to a specific user via the `user.bookings` reference.
  - Optionally linked to a container where the parcel is stored.

#### **3. Cargo Items**
- **Purpose**: Represents individual items stored within a container.
- **Key Fields**:
  - `length`, `breadth`, and `height`: Physical dimensions of the cargo item.
  - `from` and `to`: Source and destination cities (validated against the same predefined city list).
- **Relations**:
  - Stored in a container via the `container.cargoItems` array.

#### **4. Containers**
- **Purpose**: Represents physical containers used to transport parcels.
- **Key Fields**:
  - `length`, `breadth`, and `height`: Dimensions of the container.
  - `from` and `to`: Source and destination cities.
  - `availableFrom` and `availableUntil`: Time period during which the container is available for booking.
  - `cargoItems`: An array of `ObjectId` references to the `CargoItem` collection.
- **Relations**:
  - Stores multiple cargo items (parcels) in the `cargoItems` array.
  - Linked to an admin via the `admin.containers` reference.

#### **5. Admins**
- **Purpose**: Represents administrators who manage containers.
- **Key Fields**:
  - `name`, `email`, `phone`, and `password`: Admin information.
  - `containers`: An array of `ObjectId` references to the `Container` collection.
- **Relations**:
  - Each admin manages multiple containers.

---

### **Schema Highlights**

#### **a. Validation with Enums**
- `from` and `to` fields across `bookingSchema`, `cargoItemSchema`, and `containerSchema` use an enumeration (`enum`) to validate against a predefined list of cities.
- This ensures that only valid cities from the system's database are used for bookings and container management.

#### **b. Dimension Calculations**
- **Methods**:
  - `calculateVolume()`: Calculates the volume of a parcel or container using its dimensions (`length`, `breadth`, `height`).
  - `checkAvailableSpace()`: Validates whether a new parcel can fit into a container by comparing available space with the parcel's volume.
  - `percentageUsed()`: Calculates the percentage of container space currently occupied by cargo items.
- These methods ensure that space constraints are adhered to, preventing overbooking or exceeding container capacity.

#### **c. Relationship between Entities**
- A **User** has multiple **Bookings**, each of which is associated with a specific **Container** if confirmed.
- A **Container** contains multiple **Cargo Items**, and each item is validated for size compatibility with the container.
- Admins manage containers and are responsible for their availability and allocation.

---

### **Data Flow and Storage**

1. **User Registration and Booking**:
   - When a user registers, their data is stored in the `cres_user` collection.
   - Upon booking, the parcel details are added to the `bookings` collection, and the user's `bookings` array is updated with the booking ID.

2. **Container Allocation**:
   - When a booking is confirmed, the backend assigns a suitable container based on the route and space availability.
   - The `destinedContainer` field in the `bookingSchema` is updated with the container's `ObjectId`.
   - The container's `cargoItems` array is updated with the cargo item's `ObjectId`.

3. **Admin Container Management**:
   - Admins create and manage containers. Containers are stored in the `containers` collection and referenced by the admin's `containers` array.
   - Admins can track containers its occupancy using `percentageUsed()`.

---

This modular schema design facilitates clear relationships between entities, validation of input data, and efficient operations for booking, container allocation, and cargo management.

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

### **3. Environment Variables**
Create a `.env` file in the backend directory with the following configurations:
```plaintext
MONGO_URI=mongodb://localhost:27017/cargo-track
JWT_SECRET=your-jwt-secret
NODEMAILER_EMAIL=your-email@example.com
NODEMAILER_PASSWORD=your-email-password
```

### **4. Run the Project**
To run both the backend and frontend in development:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### **5. Production Build**
For production, use Docker or build the frontend:
```bash
# Build frontend for production
cd frontend
npm run build
```
