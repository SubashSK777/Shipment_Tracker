import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  LinearProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import Api from "../api";
import { CargoItemList } from "./CargoItemList";
import { useState } from "react";

export const ContainerLs = ({
  containers,
  onContainerDeleted,
  onCargoDeleted,
}) => {
  const [spacePercentage, setSpacePercentage] = useState([]);
  const handleDeleteContainer = async (containerId) => {
    try {
      await Api.deleteContainer(containerId);
      toast.success("Container deleted successfully!");
      onContainerDeleted();
    } catch (err) {
      console.error("Error deleting container", err);
      toast.error("Failed to delete container");
    }
  };

  useEffect(() => {
    if (containers.length > 0) {
      console.log("containers", containers);

      const getSpacePercentage = () => {
        const percentage = containers.map((container) => {
          const totalSpace =
            container.length * container.breadth * container.height;
          const filledSpace = container.cargoItems.reduce((acc, item) => {
            return acc + item.length * item.breadth * item.height;
          }, 0);
          return (filledSpace / totalSpace) * 100;
        });
        setSpacePercentage(percentage);
      };
      getSpacePercentage();
    }
  }, [containers]);

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Containers
      </Typography>

      <Grid container spacing={4}>
        {containers.map((container, index) => (
          <Grid item xs={12} key={container._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Container #{container._id}
                </Typography>
                <Typography>
                  Dimensions: {container.length} x {container.breadth} x{" "}
                  {container.height}
                </Typography>
                <Typography>Cost: ${container.cost}</Typography>
                <Typography>Route: {container.route?.name || "N/A"}</Typography>
                <Typography>
                  Current Location: {container.currentLocation?.name || "N/A"}
                </Typography>
                <Typography>Status: {container.status}</Typography>
                <Typography>Location History:</Typography>
                <ul>
                  {container.locationHistory.map((loc, idx) => (
                    <li key={idx}>
                      {loc.city?.name || "Unknown"} (Arrived:{" "}
                      {new Date(loc.arrivalTime).toLocaleString()})
                    </li>
                  ))}
                </ul>

                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Space Utilization:</strong>{" "}
                    {spacePercentage[index]?.toFixed(2) || 0}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={spacePercentage[index] || 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                </Box>
                <CargoItemList
                  cargoItems={container.cargoItems}
                  onCargoDeleted={() => onCargoDeleted(container._id)}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteContainer(container._id)}
                  sx={{ mt: 2 }}
                >
                  Delete Container
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
