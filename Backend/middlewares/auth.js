import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWTkey;

const auth = (req, res, next) => {
  try {
    console.log("hit auth");

    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, SECRET_KEY);
      console.log(user);
      const { id, email } = user;
      req.body.userID = id;
      req.body.email = email;
      req.body.isAdmin = user.isAdmin;
      console.log("auth check", req.body);
    } else {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized User", error: error });
  }
};

export default auth;
