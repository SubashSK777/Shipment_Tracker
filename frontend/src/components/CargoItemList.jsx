import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import Api from "../api";

export const CargoItemList = ({ cargoItems, onCargoDeleted }) => {
  const handleDeleteCargoItem = async (cargoItemId) => {
    try {
      await Api.deleteCargoItem(cargoItemId);
      toast.success("Cargo item deleted successfully!");
      onCargoDeleted();
    } catch (err) {
      console.error("Error deleting cargo item", err);
      toast.error("Failed to delete cargo item");
    }
  };

  if (!cargoItems.length) {
    return <Typography>No cargo items available.</Typography>;
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Cargo Items:
      </Typography>
      <List>
        {cargoItems.map((cargoItem) => (
          <ListItem key={cargoItem._id} disableGutters>
            <ListItemText
              primary={`Cargo Item #${cargoItem._id}`}
              secondary={`Name: ${cargoItem.name}, Weight: ${cargoItem.weight}`}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDeleteCargoItem(cargoItem._id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
