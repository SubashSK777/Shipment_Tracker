import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import Api from "../api";
import { toast } from "react-toastify";

export const ContainerForm = ({ onContainerAdded, routes }) => {
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [height, setHeight] = useState("");
  const [cost, setCost] = useState("");
  const [routeId, setRoute] = useState("");
  const [routesList, setRoutes] = useState([]);
  const [adminId, setAdminId] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const adminId = user?.id;
    setAdminId(adminId);
  }, []);

  useEffect(() => {
    if (routes) {
      setRoutes(routes);
    }
  }, [routes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const containerData = {
        length,
        breadth,
        height,
        availableFrom,
        availableUntil,
        cost,
        routeId,
      };
      await Api.setContainer({ adminId, containerData });
      toast.success("Container added successfully!");
      onContainerAdded();
      setLength("");
      setBreadth("");
      setHeight("");
      setCost("");
      setRoute("");
    } catch (err) {
      console.error("Error adding container:", err);
      toast.error("Failed to add container.");
    }
  };

  return (
    <Box>
      <Typography variant="h5">Add Container</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Length"
          type="number"
          fullWidth
          value={length}
          onChange={(e) => setLength(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Breadth"
          type="number"
          fullWidth
          value={breadth}
          onChange={(e) => setBreadth(e.target.value)}
          required
          margin="normal"
        />

        <TextField
          label="Height"
          type="number"
          fullWidth
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
          margin="normal"
        />

        <TextField
          label="Available From"
          type="date"
          fullWidth
          value={availableFrom}
          onChange={(e) => setAvailableFrom(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Available Until"
          type="date"
          fullWidth
          value={availableUntil}
          onChange={(e) => setAvailableUntil(e.target.value)}
          required
          margin="normal"
        />

        <TextField
          label="Cost"
          type="number"
          fullWidth
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Route"
          select
          fullWidth
          value={routeId}
          onChange={(e) => setRoute(e.target.value)}
          required
          margin="normal"
        >
          {routesList.map((route) => (
            <MenuItem key={route._id} value={route._id}>
              {route.name}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Add Container
        </Button>
      </form>
    </Box>
  );
};
