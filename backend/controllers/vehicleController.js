import Vehicle from "../models/Vehicle.js";


// Add vehicle
export async function addVehicle(req, res) {

  try {
    let imagePaths = [];
    if (req.files) {
      imagePaths = req.files.map(function (file) {
        return file.filename;
      });
    }

    const vehicle = await Vehicle.create({
      ...req.body,
      images: imagePaths
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// Get all vehicle
export async function getVehicles(req, res) {

  try {
    const { type, search, city } = req.query;
    let filter = {};
    if (type) {
      filter.type = type;
    }
    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const vehicles = await Vehicle.find(filter);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }

}


// GET SINGLE VEHICLE
export async function getVehicle(req, res) {

  try {
    const vehicle = await Vehicle.findById(req.params.id);
    res.json(vehicle);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// Update vehicle
export async function updateVehicle(req, res) {

  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}


// Delete vehicle
export async function deleteVehicle(req, res) {

  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({
      message: "Vehicle deleted"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}