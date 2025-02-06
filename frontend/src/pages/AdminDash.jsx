import React, { useState, useEffect } from "react";
import { ContainerForm } from "../components/ContainerForm";
import { ContainerLs } from "../components/ContainerLs";
import { AddCityForm } from "../components/AddCityForm";
import { AddRouteForm } from "../components/AddRouteForm";
import { UpdateContainerStatus } from "../components/UpdateContainerStatus";
import Api from "../api";
import { toast } from "react-toastify";
import { Grid, Typography, Box } from "@mui/material";

export const AdminDash = () => {
  const [containers, setContainers] = useState([]);
  const [cities, setCities] = useState([]);
  const [routes, setRoutes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.id;

  const fetchContainers = async () => {
    try {
      const response = await Api.getContainers(id);
      setContainers(response.data);
      toast.success("Containers fetched successfully!");
    } catch (err) {
      console.error("Error fetching containers", err);
      toast.error(err.response?.data?.message || "Failed to fetch containers");
    }
  };

  const fetchCities = async () => {
    try {
      const response = await Api.getCities();
      console.log("Cities fetched successfully", response.data);
      setCities(response.data);
    } catch (err) {
      console.error("Error fetching cities", err);
      toast.error("Failed to fetch cities");
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await Api.getRoutes();
      console.log("Routes fetched successfully", response.data);
      setRoutes(response.data);
    } catch (err) {
      console.error("Error fetching routes", err);
      toast.error("Failed to fetch routes");
    }
  };

  useEffect(() => {
    fetchContainers();
    fetchCities();
    fetchRoutes();
  }, []);

  const onDataUpdated = () => {
    fetchContainers();
    fetchCities();
    fetchRoutes();
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <AddCityForm onCityAdded={onDataUpdated} />
        </Grid>
        <Grid item xs={12}>
          {cities.length === 0 ? (
            <Typography variant="body1">Loading cities...</Typography>
          ) : (
            <AddRouteForm cities={cities} onRouteAdded={onDataUpdated} />
          )}
        </Grid>
        <Grid item xs={12}>
          {routes.length === 0 ? (
            <Typography variant="body1">Loading routes...</Typography>
          ) : (
            <ContainerForm routes={routes} onContainerAdded={onDataUpdated} />
          )}
        </Grid>
        <Grid item xs={12}>
          <UpdateContainerStatus
            containers={containers}
            onStatusUpdated={onDataUpdated}
          />
        </Grid>
        <Grid item xs={12}>
          <ContainerLs containers={containers} />
        </Grid>
      </Grid>
    </Box>
  );
};
