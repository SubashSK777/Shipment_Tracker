import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  List,
  ListItem,
  IconButton,
  Divider,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import Api from "../api/index";

export const AddRouteForm = ({ cities, onRouteAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    cities: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCitySelection = (cityId) => {
    if (formData.cities.includes(cityId)) {
      setFormData((prev) => ({
        ...prev,
        cities: prev.cities.filter((id) => id !== cityId),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        cities: [...prev.cities, cityId],
      }));
    }
  };

  const moveCity = (index, direction) => {
    const newCities = [...formData.cities];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newCities.length) {
      [newCities[index], newCities[targetIndex]] = [
        newCities[targetIndex],
        newCities[index],
      ];
      setFormData((prev) => ({ ...prev, cities: newCities }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Api.addRoute(formData);
      toast.success("Route added successfully!");
      onRouteAdded();
      setFormData({ name: "", cities: [] });
    } catch (error) {
      console.error("Error adding route", error);
      toast.error("Failed to add route.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Route Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Available Cities"
            value=""
            onChange={(e) => handleCitySelection(e.target.value)}
          >
            {cities.map((city) => (
              <MenuItem key={city._id} value={city._id}>
                {city.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <List>
            {formData.cities.map((cityId, index) => {
              const city = cities.find((c) => c._id === cityId);
              return (
                <ListItem
                  key={cityId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    padding: "8px",
                  }}
                >
                  <span style={{ flex: 1 }}>
                    {city?.name || "Unknown City"}
                  </span>
                  <IconButton
                    onClick={() => moveCity(index, -1)}
                    disabled={index === 0}
                    size="small"
                  >
                    <ArrowUpward />
                  </IconButton>
                  <IconButton
                    onClick={() => moveCity(index, 1)}
                    disabled={index === formData.cities.length - 1}
                    size="small"
                  >
                    <ArrowDownward />
                  </IconButton>
                  <Divider orientation="vertical" flexItem />
                  <IconButton
                    onClick={() => handleCitySelection(cityId)}
                    size="small"
                  >
                    <RemoveCircleOutline />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Route
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
