// routers/cargoRoutes.js
import express from "express";
import {
  addContainer,
  getContainers,
  updateContainerLocation,
} from "../controllers/cargoController.js";
import {
  createBooking,
  getBookings,
  makePayment,
} from "../controllers/bookingController.js";
import userController from "../controllers/userController.js";
import auth from "../middlewares/auth.js";
import CityRouteController from "../controllers/cityRouteController.js";

const uc = new userController();
const router = express.Router();
const crc = new CityRouteController();

router.post("/admin/login", uc.loginAdmin);
router.post("/admin/register", uc.registerAdmin);
router.post("/admin/container",auth, addContainer);
router.get("/admin/:adminId/containers", getContainers);
router.post("/booking", auth, createBooking);
router.post("/booking/payment",auth, makePayment);
router.get("/booking", auth, getBookings);
router.post("/admin/containerupdate", auth, updateContainerLocation);
router.post("/admin/addcity", auth, crc.addCity);
router.get("/admin/getcities", auth, crc.getCities);
router.post("/admin/addroutes", auth, crc.createRoute);
router.get("/admin/getroutes", auth, crc.getRoutes);

export default router;
