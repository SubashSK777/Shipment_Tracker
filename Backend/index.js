// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import User from "./models/userSchema.js"; // Ensure the path is correct
// import userRouter from "./routers/userRouter.js"; // Import your user routes
// dotenv.config();

// // Express configuration
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB connection
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("MongoDB connected successfully!");
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//         process.exit(1); // Exit the process if connection fails
//     }
// };

// // Test API endpoint
// app.get("/test", (req, res) => {
//     res.send("Hello World! Go To /api");
// });

// // Base router
// const bR = express.Router();
// app.use("/api", bR);

// bR.get("/", (req, res) => {
//     res.send("v0.0.1");
// });

// // User routes
// bR.use("/user", userRouter); // Mount user routes

// // Start server
// const PORT = process.env.PORT || 5001;

// app.listen(PORT, async () => {
//     console.clear();
//     await connectDB(); // Connect to the database before starting the server
//     console.log(`Server is running at http://localhost:${PORT}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import init from "./db/config.js";
import uR from "./routers/userRouter.js";
import cargoRoutes from "./routers/cargoRoutes.js";

dotenv.config();

// express config
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test api
app.get("/test", (req, res) => {
  res.send("Hello World! Go To /api");
});

// base router
const bR = express.Router();
app.use("/api", bR);

bR.get("/", (req, res) => {
  res.send("v0.0.1");
});

// Routes /api/{route}
bR.use("/user", uR);
bR.use("/cargo", cargoRoutes); 
// start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.clear();
  init();
  console.log(`Server @ http://localhost:${PORT}`);
});
