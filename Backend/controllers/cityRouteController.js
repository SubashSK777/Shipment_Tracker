import { City, Route } from "../models/cargoModels.js";

class CityRouteController {
  constructor() {}

  getCities = async (req, res) => {
    try {
      const cities = await City.find();
      console.log(cities);
      res.status(200).json(cities);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching cities",
        error: error.message,
      });
    }
  };

  addCity = async (req, res) => {
    try {
      const { name, state } = req.body;

      const existingCity = await City.findOne({ name, state });
      if (existingCity) {
        return res.status(400).json({ message: "City already exists" });
      }

      const newCity = new City({
        name,
        state,
      });

      await newCity.save();
      res.status(201).json({
        message: "City added successfully",
        city: newCity,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error adding city",
        error: error.message,
      });
    }
  };
  createRoute = async (req, res) => {
    try {
      const { name, cities, isAdmin } = req.body;

      if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedCities = [];
      for (const cityid of cities) {
        const city = await City.findById(cityid);
        if (!city) {
          return res.status(400).json({
            message: `City with ID ${cityid} not found`,
          });
        }
        validatedCities.push({ city: cityid });
      }

      const newRoute = new Route({
        name,
        cities: validatedCities,
      });

      await newRoute.save();
      res.status(201).json({
        message: "Route created successfully",
        route: newRoute,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating route",
        error: error.message,
      });
    }
  };

  getRoutes = async (req, res) => {
    try {
      const { isAdmin } = req.body;

      if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const routes = await Route.find().populate("cities.city");
      res.status(200).json(routes);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching routes",
        error: error.message,
      });
    }
  };

  findRoutes = async (req, res) => {
    try {
      const { fromCityId, toCityId } = req.body;

      const routes = await Route.find({
        "cities.city": { $all: [fromCityId, toCityId] },
      }).populate("cities.city");

      const validRoutes = routes.filter((route) => {
        const fromIndex = route.cities.findIndex(
          (c) => c.city._id.toString() === fromCityId
        );
        const toIndex = route.cities.findIndex(
          (c) => c.city._id.toString() === toCityId
        );
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
      });

      if (validRoutes.length === 0) {
        return res.status(400).json({ message: "No routes found" });
      }

      res.status(200).json({ routes: validRoutes });
    } catch (error) {
      res.status(500).json({
        message: "Error finding routes",
        error: error.message,
      });
    }
  };
}

export default CityRouteController;
