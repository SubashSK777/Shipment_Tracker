import {
  Admin,
  CargoItem,
  Container,
  City,
  Route,
} from "../models/cargoModels.js";

export const addContainer = async (req, res) => {
  const { adminId, containerData } = req.body;
  try {
    const { routeId, availableFrom, availableUntil } = containerData;
    if (!routeId) return res.status(400).json({ message: "Route is required" });
    const route = await Route.findById(routeId);
    if (!route) return res.status(404).json({ message: "Route not found" });
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (new Date(availableFrom) < new Date()) {
      return res.status(400).json({
        message: "Available from date should be after the current date",
      });
    }

    if (new Date(availableUntil) < new Date(availableFrom)) {
      return res.status(400).json({
        message: "Available until date should be after the available from date",
      });
    }

    const newContainer = new Container({
      ...containerData,
      route: routeId,
      currentLocation: route.cities[0].city,
    });

    await newContainer.save();
    admin.containers.push(newContainer._id);
    await admin.save();

    res.status(201).json({
      message: "Container created successfully",
      container: newContainer,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getContainers = async (req, res) => {
  const { adminId } = req.params;
  try {
    const admin = await Admin.findById(adminId).populate({
      path: "containers",
      populate: {
        path: "cargoItems",
      },
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(admin.containers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateContainerLocation = async (req, res) => {
  const { containerId, cityId, status } = req.body;

  try {
    const container = await Container.findById(containerId).populate("route");
    if (!container) {
      return res.status(404).json({ message: "Container not found" });
    }

    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const routeCities = container.route.cities.map((cityObj) =>
      cityObj.city.toString()
    );
    if (!routeCities.includes(cityId)) {
      return res.status(400).json({ message: "City not in the route." });
    }

    container.currentLocation = cityId;
    container.locationHistory.push({ city: cityId });

    if (status) {
      container.status = status;
    }

    await container.save();

    const updateQuery = {
      destinedContainer: containerId,
      route: container.route._id,
      status: { $ne: "DELIVERED" },
    };

    const bookings = await CargoItem.find(updateQuery);

    const updatePromises = bookings.map(async (booking) => {
      const isFinalDestination = cityId === routeCities[routeCities.length - 1];

      if (!isFinalDestination) {
        booking.trackingLogs.push({
          location: cityId,
          status: "IN_TRANSIT",
          timestamp: new Date(),
        });
        booking.status = "IN_PROGRESS";
      } else {
        booking.trackingLogs.push({
          location: cityId,
          status: "DELIVERED",
          timestamp: new Date(),
        });
        booking.status = "DELIVERED";
      }

      await booking.save();
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      message: `Container location updated successfully. Bookings updated accordingly.`,
      container,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating container location",
      error: error.message,
    });
  }
};
