import mongoose from "mongoose";
import cities from "../data/cities.json" assert { type: "json" };

// const bookingSchema = new mongoose.Schema({
//   from: { type: String, required: true, enum: cities },
//   to: { type: String, required: true, enum: cities },
//   height: { type: Number, required: true },
//   width: { type: Number, required: true },
//   breadth: { type: Number, required: true },
//   description: { type: String, required: false },
//   status: { type: String, default: "Pending" },
//   isPaid: { type: Boolean, default: false },
//   requiredOn: { type: Date, required: true },
//   cost: { type: Number, required: true },
//   destinedContainer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Container",
//     required: false,
//   },
//   route: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Route",
//   },
//   trackingLogs: [
//     {
//       location: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "City",
//       },
//       status: {
//         type: String,
//         enum: ["PICKED_UP", "IN_TRANSIT", "ARRIVED"],
//       },
//       timestamp: {
//         type: Date,
//         default: Date.now,
//       },
//       default: [],
//     },
//   ],
// });

// bookingSchema.methods.isSameRoute = function () {
//   return this.from === this.to;
// };

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: Number },
  password: { type: String },
  otp: { type: String },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CargoItem",
      default: [],
    },
  ],
});

const User = mongoose.model("user", userSchema);
// const Booking = mongoose.model("bookings", bookingSchema);
export default User;
export { User };
