import Reader from "../../model/readerModel.js";
import { generateMemberShipId } from "../../utils/helper.js";
import mongoose from "mongoose";

export const createReaders = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      membershipType,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !dateOfBirth ||
      !membershipType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingReader = await Reader.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (existingReader) {
      return res.status(400).json({
        success: false,
        message: "Reader already exists",
      });
    }

    const reader = await Reader.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      membershipType,
      memberShipId: generateMemberShipId(),
    });

    return res.status(201).json({
      success: true,
      message: "Reader created successfully",
      data: reader,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create reader",
      error: error.message,
    });
  }
};

export const getAllReaders = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    // Search
    const searchQuery = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { lastName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            { memberShipId: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    // Additional filters
    if (req.query.isActive) {
      searchQuery.isActive = req.query.isActive === "true";
    }
    if (req.query.membershipType) {
      searchQuery.membershipType = req.query.membershipType;
    }
    if (req.query.isBlacklisted) {
      searchQuery.isBlacklisted = req.query.isBlacklisted === "true";
    }

    const readers = await mongoose
      .model("reader")
      .find(searchQuery)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate("borrowedBooks.bookId", "title isbn"); // Optional: populate borrowed books info

    const totalReaders = await mongoose
      .model("reader")
      .countDocuments(searchQuery);
    const totalPages = Math.ceil(totalReaders / limit);

    return res.status(200).json({
      success: true,
      message: "Readers fetched successfully",
      data: readers,
      totalReaders,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch readers",
      error: error.message,
    });
  }
};

export const getReaderById = async (req, res) => {
  try {
    const reader = await mongoose
      .model("reader")
      .findById(req.params.id)
      .populate("borrowedBooks.bookId", "title isbn author"); // Populate book details for borrowed books

    if (!reader) {
      return res.status(404).json({
        success: false,
        message: "Reader not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reader fetched successfully",
      data: reader,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reader",
      error: error.message,
    });
  }
};

export const updateReader = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      membershipType,
      membershipEndDate,
      isActive,
      isBlacklisted,
      isBlacklistedReason,
    } = req.body;

    // Find the reader
    const reader = await mongoose.model("reader").findById(req.params.id);
    if (!reader) {
      return res.status(404).json({
        success: false,
        message: "Reader not found",
      });
    }

    // Validate email uniqueness if changed
    if (email && email !== reader.email) {
      const existingReader = await mongoose.model("reader").findOne({ email });
      if (existingReader && existingReader._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
    }

    // Validate phone uniqueness if changed
    if (phone && phone !== reader.phone) {
      const existingReader = await mongoose.model("reader").findOne({ phone });
      if (existingReader && existingReader._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }

      // Validate phone format
      const phoneRegex =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number format",
        });
      }
    }

    // Validate membership type if changed
    if (membershipType && membershipType !== reader.membershipType) {
      const validMembershipTypes = ["basic", "premium", "gold"]; // Add your valid types
      if (!validMembershipTypes.includes(membershipType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid membership type",
        });
      }
    }

    // Update reader fields
    reader.firstName = firstName || reader.firstName;
    reader.lastName = lastName || reader.lastName;
    reader.email = email || reader.email;
    reader.phone = phone || reader.phone;

    if (address) {
      reader.address = {
        street: address.street || reader.address.street,
        city: address.city || reader.address.city,
        state: address.state || reader.address.state,
        country: address.country || reader.address.country,
        zipCode: address.zipCode || reader.address.zipCode,
      };
    }

    reader.dateOfBirth = dateOfBirth || reader.dateOfBirth;
    reader.membershipType = membershipType || reader.membershipType;
    reader.membershipEndDate = membershipEndDate || reader.membershipEndDate;
    reader.isActive = isActive !== undefined ? isActive : reader.isActive;
    reader.isBlacklisted =
      isBlacklisted !== undefined ? isBlacklisted : reader.isBlacklisted;

    if (isBlacklistedReason !== undefined) {
      reader.isBlacklistedReason = isBlacklistedReason;
    }

    reader.updatedAt = new Date();

    await reader.save();

    res.status(200).json({
      success: true,
      message: "Reader updated successfully",
      data: reader,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update reader",
      error: error.message,
    });
  }
};

export const deleteReader = async (req, res) => {
  try {
    const reader = await mongoose.model("reader").findByIdAndDelete(req.params.id);
    if (!reader) {
      return res.status(404).json({
        success: false,
        message: "Reader not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Reader deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete reader",
      error: error.message,
    });
  }
};