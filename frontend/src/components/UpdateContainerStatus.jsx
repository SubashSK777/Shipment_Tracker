import React, { useState, useEffect } from "react";
import { Box, Button, MenuItem, Typography, TextField } from "@mui/material";
import Api from "../api";
import { toast } from "react-toastify";

export const UpdateContainerStatus = ({ containers = [], onStatusUpdated }) => {
  const [selectedContainer, setSelectedContainer] = useState("");
  const [city, setCity] = useState("");
  const [availableCities, setAvailableCities] = useState([]);
 
  useEffect(() => {
    console.log("Containers received:", containers);
  }, [containers]);

  useEffect(() => {
    if (selectedContainer) {
      const container = containers.find((c) => c._id === selectedContainer);

      if (container && container.route) {
        Api.getRouteCities(container.route._id)
          .then((response) => {
            const cities = response.data;
            const unvisitedCities = cities.filter(
              (city) =>
                !container.locationHistory.some((loc) => loc.city === city._id)
            );
            setAvailableCities(unvisitedCities);
          })
          .catch((err) => {
            console.error("Error fetching route cities:", err);
            toast.error("Failed to load cities.");
          });
      } else {
        console.warn(
          "Container or route not found for the selected container."
        );
        setAvailableCities([]);
      }
    } else {
      setAvailableCities([]);
    }
  }, [selectedContainer, containers]);

  const handleUpdate = async () => {
    if (!selectedContainer || !city) {
      toast.error("Please select a container and a city.");
      return;
    }

    try {
      await Api.updateContainerStatus(selectedContainer, { city });
      toast.success("Status updated successfully!");
      onStatusUpdated();
      setSelectedContainer("");
      setCity("");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status.");
    }
  };

  return (
    <Box>
      <Typography variant="h5">Update Container Status</Typography>
      <TextField
        label="Select Container"
        select
        fullWidth
        value={selectedContainer}
        onChange={(e) => setSelectedContainer(e.target.value)}
        margin="normal"
        required
      >
        {containers.map((container) =>
          container && container._id ? ( // Add a safeguard
            <MenuItem key={container._id} value={container._id}>
              Container #{container._id}
            </MenuItem>
          ) : null
        )}
      </TextField>
      <TextField
        label="Select City"
        select
        fullWidth
        value={city}
        onChange={(e) => setCity(e.target.value)}
        margin="normal"
        disabled={!selectedContainer}
        required
      >
        {availableCities.map((city) => (
          <MenuItem key={city._id} value={city._id}>
            {city.name}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        fullWidth
        disabled={!selectedContainer || !city}
      >
        Update Status
      </Button>
    </Box>
  );
};
