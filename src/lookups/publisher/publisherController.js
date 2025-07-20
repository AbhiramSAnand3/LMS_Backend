import { createNameAlias } from "../../utils/helper.js";
import Publisher from "../../model/lookups/publisherModel.js";
import mongoose from "mongoose";

export const createPublisher = async (req, res) => {
  try {
    const { name, address, website, contactEmail, phone, foundedYear } =
      req.body;
    const nameAlias = createNameAlias(name);

    const existingPublisher = await Publisher.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, "i") } },
        { nameAlias: nameAlias },
      ],
    });

    if (existingPublisher) {
      return res.status(400).json({
        success: false,
        message: "Publisher already exists",
      });
    }

    const publisher = new Publisher({
      name,
      nameAlias,
      address,
      website,
      contactEmail,
      phone,
      foundedYear,
    });

    await publisher.save();
    return res.status(201).json({
      success: true,
      message: "Publisher created successfully",
      data: publisher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create publisher",
      error: error.message,
    });
  }
};

export const getAllPublishers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1;

    const searchQuery = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { nameAlias: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const publishers = await Publisher.find(searchQuery)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalPublishers = await Publisher.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalPublishers / limit);

    return res.status(200).json({
      success: true,
      message: "Publishers fetched successfully",
      data: publishers,
      totalPublishers,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch publishers",
      error: error.message,
    });
  }
};

export const getPublisherById = async (req, res) => {
  try {
    let publisher;
    if (mongoose.Types.ObjectId.isValid(req.params.idOrAlias)) {
      publisher = await Publisher.findById(req.params.idOrAlias);
    } else {
      publisher = await Publisher.findOne({
        nameAlias: req.params.idOrAlias,
      });
    }
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Publisher fetched successfully",
      data: publisher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch publisher",
      error: error.message,
    });
  }
};

export const updatePublisher = async (req, res) => {
  try {
    const { name, address, website, contactEmail, phone, foundedYear } =
      req.body;
    const nameAlias = createNameAlias(name);

    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found",
      });
    }

    if (name) publisher.name = name;
    if (address) publisher.address = address;
    if (website) publisher.website = website;
    if (contactEmail) publisher.contactEmail = contactEmail;
    if (phone) publisher.phone = phone;
    if (foundedYear) publisher.foundedYear = foundedYear;
    if (nameAlias) publisher.nameAlias = nameAlias;

    await publisher.save();
    return res.status(200).json({
      success: true,
      message: "Publisher updated successfully",
      data: publisher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update publisher",
      error: error.message,
    });
  }
};

export const deletePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found",
      });
    }
    await publisher.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Publisher deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete publisher",
      error: error.message,
    });
  }
};
