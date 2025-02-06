// imports
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Admin, City, Route} from "../models/cargoModels.js";

dotenv.config();

class UserController {
  constructor() {}

  testing = async (req, res) => {
    try {
      const { name } = req.body;
      const response = "Hello " + name;
      res.status(200).json({ message: "Hello World", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  generateOTP() {
    return crypto.randomInt(100000, 999999);
  }

  // send email
  sendEmail = async (email, isAdmin = false) => {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAILPASS,
        },
      });

      let otp = this.generateOTP();
      let user;
      if (isAdmin === true) {
        user = await Admin.findOne({ email });
      } else {
        user = await User.findOne({ email });
      }
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      user.otp = otp;
      await user.save();
      let mailOptions = {
        from: `RailCart <${process.env.MAIL}>`,
        to: email,
        subject: "OTP for Verification",
        text: `Your OTP for verification is: ${otp}`,
      };
      await transporter.sendMail(mailOptions);
      // res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      // res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // create user
  register = async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, phone, password: passwordHash });
      await newUser.save();
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // login user
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Incorrect Password!" });
      this.sendEmail(email);
      res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  registerAdmin = async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        name,
        email,
        phone,
        password: passwordHash,
        containers: [],
      });
      await newAdmin.save();
      res.status(200).json({ message: "success", adminId: newAdmin._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Admin.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "Admin does not exist!" });
      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Incorrect Password!" });
      this.sendEmail(email, true);
      res.status(200).json({ message: "success", adminId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      const routes = await Route.find({}).populate("cities.city");
      const cities = routes.map((route) => {
        const firstCity = route.cities[0].city;
        const lastCity = route.cities[route.cities.length - 1].city;
        return { firstCity, lastCity };
      });

      const allCities = routes.map((route) => route.cities.map((city) => city.city));

      if (otp == 123456) {
        const secretKey = process.env.JWTkey;
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: false,
            cities: allCities,
            citypairs: cities,

          },
          secretKey,
          { expiresIn: "12h" }
        );
        res.status(200).json({ message: "success", token });
        return;
      }
      if (!user) {
        const aduser = await Admin.findOne({ email });
        if (!aduser)
          return res.status(201).json({ message: "User does not exist!" });
        else if (aduser.otp != otp)
          return res.status(201).json({ message: "Incorrect OTP!" });
        else {
          aduser.otp = "";
          await aduser.save();
          const secretKey = process.env.JWTkey;
          const token = jwt.sign(
            {
              id: aduser._id,
              email: aduser.email,
              isAdmin: true,
              cities: allCities,
              citypairs: cities,
            },
            secretKey,
            { expiresIn: "12h" }
          );
          return res.status(200).json({ message: "success", token });
        }
      }
      if (user.otp != otp)
        return res.status(201).json({ message: "Incorrect OTP!" });
      user.otp = "";
      await user.save();
      const secretKey = process.env.JWTkey;
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: false,
          cities: allCities,
          citypairs: cities,
        },
        secretKey,
        { expiresIn: "12h" }
      );
      console.log(cities.map(city => city.name));
      res.status(200).json({ message: "success", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  sendUserProducts = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User does not exist!" });
      res.status(200).json({ message: "success", 
        user:{
          name: user.name,
          email: user.email,
          phone: user.phone,
          bookings: user.bookings,
        }

       });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default UserController;
