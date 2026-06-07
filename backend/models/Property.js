import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "apartment",
        "villa",
        "penthouse",
        "commercial",
        "farmhouse",
        "beach-house",
      ],
      default: "apartment",
    },

    status: {
      type: String,
      enum: ["for-sale", "for-rent", "sold"],
      default: "for-sale",
    },

    bedrooms: {
      type: Number,
      default: 1,
    },

    bathrooms: {
      type: Number,
      default: 1,
    },

    area: {
      type: Number,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    amenities: [
      {
        type: String,
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
