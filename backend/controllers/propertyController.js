import Property from "../models/Property.js";

// GET all properties with search, filter, and pagination
export const getProperties = async (req, res) => {
  try {
    const {
      search,
      type,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (type) query.type = type;
    if (status) query.status = status;
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .populate("owner", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET featured properties
export const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ featured: true })
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single property
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email avatar"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    // Handle invalid MongoDB ObjectId (CastError)
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

// CREATE property
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE property
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Only owner or admin can update
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ success: true, property: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET properties by current user
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
