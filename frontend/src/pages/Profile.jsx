import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Divider,
  Icon,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; 
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; 

import { deepPurple } from "@mui/material/colors";
import Api from "../api";
import { toast } from "react-toastify";
import { redirect } from "react-router-dom";

const Profile = ({ email }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("Please login to view your profile.");
      redirect("/login");
    }

    setUserInfo(user);

    const fetchData = async () => {
      try {
        const bookingsResponse = await Api.getBookings();
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {userInfo && (
        <Card sx={{ mb: 3, p: 2, display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ bgcolor: deepPurple[500], width: 56, height: 56, mr: 2 }}
          >
            {userInfo.name?.[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {userInfo.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Email:</strong> {userInfo.email}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Phone:</strong> {userInfo.phone || "Not Provided"}
            </Typography>
          </Box>
        </Card>
      )}

      {/* Bookings */}
      <Typography variant="h4" gutterBottom>
        Your Bookings
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {bookings.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No bookings found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Booking #{booking._id}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    <strong>From:</strong> {booking.from}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    <strong>To:</strong> {booking.to}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Status:</strong> {booking.status} 
                      {booking.status === "Pending" ? (
                        <AccessTimeIcon sx={{ ml: 1, color: "orange" }} />
                      ) : (
                        <CheckCircleIcon sx={{ ml: 1, color: "green" }} />
                      )}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    <strong>Cost:</strong> ₹{booking.cost.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    <strong>Dimensions:</strong> {booking.height} x{" "}
                    {booking.width} x {booking.breadth}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Description:</strong> {booking.description || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Profile;
