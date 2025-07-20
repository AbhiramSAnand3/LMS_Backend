import { createNameAlias } from "../../utils/helper.js";
import Genre from "../../model/lookups/genreModel.js";
import Category from "../../model/lookups/categoryModel.js";
import mongoose from "mongoose";

export const createGenre = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const nameAlias = createNameAlias(name);

    if (!name || !nameAlias) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    const categoryExists = await Category.findOne({ _id: category });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
    }
    const existingGenre = await Genre.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, "i") } },
        { nameAlias: nameAlias },
      ],
    });

    if (existingGenre) {
      return res.status(400).json({
        success: false,
        message: "Genre already exists",
      });
    }

    const genres = new Genre({
      name,
      description,
      category,
      nameAlias: nameAlias,
    });

    await genres.save();
    return res.status(201).json({
      success: true,
      message: "Genre created successfully",
      data: await Genre.findById(genres._id).populate(
        "category",
        "name nameAlias",
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create genre",
      error: error.message,
    });
  }
};

export const getAllGenres = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const searchQuery = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { nameAlias: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const genres = await Genre.find({
      ...searchQuery,
      ...categoryFilter,
    })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate("category", "name nameAlias");

    const totalGenres = await Genre.countDocuments({
      ...searchQuery,
      ...categoryFilter,
    });
    const totalPages = Math.ceil(totalGenres / limit);

    return res.status(200).json({
      success: true,
      message: "Genres fetched successfully",
      data: genres,
      totalGenres,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch genres",
      error: error.message,
    });
  }
};

export const getGenreById = async (req, res) => {
  try {
    let genre;
    if (mongoose.Types.ObjectId.isValid(req.params.idOrAlias)) {
      genre = await Genre.findById(req.params.idOrAlias).populate(
        "category",
        "name nameAlias",
      );
    } else {
      genre = await Genre.findOne({
        nameAlias: req.params.idOrAlias,
      }).populate("category", "name nameAlias");
    }
    if (!genre) {
      return res.status(404).json({
        success: false,
        message: "Genre not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Genre fetched successfully",
      data: genre,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch genre",
      error: error.message,
    });
  }
};

export const updateGenre = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const nameAlias = createNameAlias(name);

    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({
        success: false,
        message: "Genre not found",
      });
    }

    if (category) {
      const categoryExists = await Category.findOne({ _id: category });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category does not exist",
        });
      }
    }

    if (name) genre.name = name;
    if (nameAlias) genre.nameAlias = nameAlias;
    if (description) genre.description = description;
    if (category) genre.category = category;

    await genre.save();
    return res.status(200).json({
      success: true,
      message: "Genre updated successfully",
      data: genre,
    });
  } catch (error) {}
};

export const deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({
        success: false,
        message: "Genre not found",
      });
    }
    await genre.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Genre deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete genre",
      error: error.message,
    });
  }
};
