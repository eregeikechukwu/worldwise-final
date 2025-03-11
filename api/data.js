import fs from "fs";
import path from "path";

// Path to the JSON file
const dataFilePath = path.resolve("./data/data.json");

// Helper function to read data from the JSON file
const readData = () => {
  const data = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(data);
};

// Helper function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export default async function handler(req, res) {
  // Handling different HTTP methods (CRUD operations)
  if (req.method === "GET") {
    // GET: Fetch all cities
    try {
      const cities = readData().cities;
      res.status(200).json(cities);
    } catch (err) {
      res.status(500).json({ error: "Error reading data" });
    }
  } else if (req.method === "POST") {
    // POST: Create a new city
    try {
      const newCity = req.body;
      const cities = readData().cities;
      newCity.id = Date.now(); // Assign a new id based on timestamp
      cities.push(newCity);
      writeData({ cities });
      res.status(201).json(newCity);
    } catch (err) {
      res.status(500).json({ error: "Error saving data" });
    }
  } else if (req.method === "DELETE") {
    // DELETE: Delete a city by ID
    const { id } = req.query;
    try {
      const cities = readData().cities;
      const updatedCities = cities.filter((city) => city.id !== parseInt(id));
      if (updatedCities.length === cities.length) {
        return res.status(404).json({ error: "City not found" });
      }
      writeData({ cities: updatedCities });
      res.status(200).json({ message: "City deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting city" });
    }
  } else {
    // Method Not Allowed
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
