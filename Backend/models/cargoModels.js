import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  cities: [
    {
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
      default: [],
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const cargoItemSchema = new mongoose.Schema({
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  breadth: { type: Number, required: true },
  description: { type: String, required: false },
  isPaid: { type: Boolean, default: false },
  cost: { type: Number, required: true },
  destinedContainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Container",
    required: false,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
  },
  trackingLogs: [
    {
      location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
      status: {
        type: String,
        enum: ["PICKED_UP", "IN_TRANSIT", "ARRIVED"],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      default: [],
    },
  ],
});

cargoItemSchema.methods.calculateVolume = function () {
  return this.length * this.breadth * this.height;
};

const containerSchema = new mongoose.Schema({
  length: {
    type: Number,
    required: true,
  },
  breadth: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  availableFrom: {
    type: Date,
    required: true,
  },
  availableUntil: {
    type: Date,
    required: true,
  },
  cargoItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CargoItem",
      default: [],
    },
  ],
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  currentLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  locationHistory: [
    {
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
      arrivalTime: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ["PENDING", "IN_TRANSIT", "COMPLETED"],
    default: "PENDING",
  },
});

containerSchema.methods.calculateVolume = function () {
  return this.length * this.breadth * this.height;
};

containerSchema.methods.checkAvailableSpace = async function (parcel) {
  const currentCargoItems = await CargoItem.find({
    _id: { $in: this.cargoItems },
  });

  let currentUsedSpace = currentCargoItems.reduce(
    (acc, item) => acc + parseFloat(item.calculateVolume()),
    0
  );

  let totalVolume = this.calculateVolume();
  let parcelVolume =
    parseFloat(parcel.length) *
    parseFloat(parcel.breadth) *
    parseFloat(parcel.height);

  totalVolume = parseFloat(totalVolume);
  currentUsedSpace = parseFloat(currentUsedSpace);
  parcelVolume = parseFloat(parcelVolume);

  console.log(totalVolume, currentUsedSpace, parcelVolume);
  if (totalVolume === currentUsedSpace) return false;
  if (totalVolume < currentUsedSpace + parcelVolume) return false;
  return true;
};

containerSchema.methods.percentageUsed = function () {
  const currentUsedSpace = this.cargoItems.reduce(
    (acc, cargoItem) =>
      acc + cargoItem.calculateVolume ? cargoItem.calculateVolume() : 0,
    0
  );
  const totalVolume = this.calculateVolume();
  return (currentUsedSpace / totalVolume) * 100;
};

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  containers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Container",
      default: [],
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);
const CargoItem = mongoose.model("CargoItem", cargoItemSchema);
const Container = mongoose.model("Container", containerSchema);
const City = mongoose.model("City", citySchema);
const Route = mongoose.model("Route", routeSchema);

export { Admin, CargoItem, Container, City, Route };
