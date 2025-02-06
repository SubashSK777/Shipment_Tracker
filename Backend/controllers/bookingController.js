import { Container, CargoItem, Route } from "../models/cargoModels.js";
import { User } from "../models/userSchema.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const createBooking = async (req, res) => {
  let { email, route, height, width, breadth, description } = req.body;
  height = parseFloat(height);
  width = parseFloat(width);
  breadth = parseFloat(breadth);

  try {
    const routeDoc = await Route.findById(route);
    if (!routeDoc) {
      return res.status(404).json({ message: "Route not found." });
    }

    const containers = await Container.find({ route }).populate("cargoItems");
    if (!containers.length) {
      return res
        .status(400)
        .json({ message: "No containers available for the specified route." });
    }

    const parcel = { height, length: width, breadth };
    const maxParcelDimension = Math.max(parcel.height, parcel.length, parcel.breadth);

    let availableContainer = null;
    for (const container of containers) {
      const maxContainerDimension = Math.max(container.height, container.length, container.breadth);

      if (maxParcelDimension > maxContainerDimension) {
        continue; 
      }

      const isAvailable = await container.checkAvailableSpace(parcel);
      if (isAvailable) {
        availableContainer = container;
        break; 
      }
    }

    if (!availableContainer) {
      return res.status(400).json({
        message: "Not enough space to accommodate the parcel in any available container.",
        proceedToPayment: false,
      });
    }

    const cost = parcel.height * parcel.length * parcel.breadth * availableContainer.cost;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.bookings) {
      user.bookings = [];
    }

    const cargoItem = new CargoItem({
      height,
      width,
      breadth,
      description,
      cost,
      route: availableContainer.route,
      destinedContainer: availableContainer._id,
    });

    await cargoItem.save(); 

    user.bookings.push(cargoItem._id);
    await user.save();

    res.status(200).json({
      message: `Space available in container ${availableContainer._id}, Proceed to payment.`,
      proceedToPayment: true,
      bookingID: cargoItem._id,
      cost: cost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing booking.", error });
  }
};

export const getBookings = async (req, res) => {
  const { userID } = req.body;

  try {
    const user = await User.findById(userID).populate("bookings");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user.bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings.", error });
  }
};

export const makePayment = async (req, res) => {
  const { bookingId, email } = req.body;

  try {
    const cargoItem = await CargoItem.findById(bookingId).populate("destinedContainer");
    if (!cargoItem) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const container = cargoItem.destinedContainer;
    if (!container) {
      return res.status(404).json({ message: "No container found for the booking." });
    }

    const parcel = {
      height: cargoItem.height,
      breadth: cargoItem.breadth,
      length: cargoItem.width,
    };

    if (!container.checkAvailableSpace(parcel)) {
      return res.status(400).json({ message: "Not enough space in the container." });
    }

    if (cargoItem.isPaid) {
      return res.status(400).json({ message: "Booking already paid for." });
    }

    cargoItem.isPaid = true;
    await cargoItem.save();

    container.cargoItems.push(cargoItem);
    await container.save();

    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAILPASS,
        },
      });

      let mailOptions = {
        from: `RailCart <${process.env.MAIL}>`,
        to: email,
        subject: "Booking payment successful",
        html: `<h1>Booking payment successful</h1>
        <p>Your booking from ${cargoItem.from} to ${cargoItem.to} has been confirmed.</p>
        <p>Cost: ₹${cargoItem.cost}</p>
        <br>
        <p>Container details:</p>
        <p>Container ID: ${container._id}</p>
        <p>Container from: ${container.from}</p>
        <p>Container to: ${container.to}</p>
        <p>Container available from: ${container.availableFrom}</p>
        <p>Container cost: ₹${container.cost}</p>
        <p>Container dimensions: ${container.height}ft x ${container.length}ft x ${container.breadth}ft</p>
        <br>
        <p>Cargo item details:</p>
        <p>Cargo item ID: ${cargoItem._id}</p>
        <p>Cargo item name: ${cargoItem.description}</p>
        <p>Cargo item dimensions: ${cargoItem.height}ft x ${cargoItem.width}ft x ${cargoItem.breadth}ft</p>
        `,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({
      message: "Payment successful. Cargo item added to container.",
      cargoItemId: cargoItem._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error processing payment and cargo allocation.",
      error,
    });
  }
};

export const getBookingLogs = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const cargoItem = await CargoItem.findById(bookingId);
    if (!cargoItem) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json(cargoItem.trackingLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching booking logs.", error });
  }
};