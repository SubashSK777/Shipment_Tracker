import React, { useState } from "react";
import { TextField, Button, Grid, Autocomplete } from "@mui/material";
import { toast } from "react-toastify";
import Api from "../api/index";

const states = [
  "Maharashtra",
  "Uttar Pradesh",
  "Tamil Nadu",
  "Karnataka",
  "Delhi",
  "Gujarat",
  "West Bengal",
  "Rajasthan",
  "Uttarakhand",
  "Madhya Pradesh",
  "Haryana",
  "Bihar",
  "Kerala",
  "Punjab",
  "Odisha",
  "Assam",
  "Jharkhand",
  "Chhattisgarh",
  "Telangana",
  "Andhra Pradesh",
  "Jammu and Kashmir",
  "Himachal Pradesh",
  "Goa",
  "Tripura",
  "Manipur",
  "Nagaland",
  "Arunachal Pradesh",
  "Mizoram",
  "Sikkim",
  "Meghalaya",
  "Puducherry",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Lakshadweep",
  "Andaman and Nicobar Islands",
];

export const AddCityForm = ({ onCityAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    state: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Api.addCity(formData);
      toast.success("City added successfully!");
      onCityAdded();
      setFormData({ name: "", state: "" });
    } catch (error) {
      console.error("Error adding city", error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            freeSolo
            options={states}
            value={formData.state}
            onChange={(event, newValue) => {
              setFormData({ ...formData, state: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} label="State" name="state" required />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add City
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
