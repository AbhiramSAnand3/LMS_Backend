import mongoose, { mongo } from "mongoose";
import Category from "../../model/lookups/categoryModel.js";
import { createNameAlias } from "../../utils/helper.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const nameAlias = createNameAlias(name);

    const existingCategory = await Category.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, "i") } },
        { nameAlias: nameAlias },
      ],
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      nameAlias: nameAlias,
    });

    await category.save();
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1;

    const searchQuery = req.query.search
      ? { $name: { $regex: req.query.search, $options: "i" } }
      : {};

    const categories = await Category.find(searchQuery)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalCategories = await Category.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCategories / limit);

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
      totalCategories,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  let category;
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.idOrAlias)) {
      category = await Category.findById(req.params.idOrAlias);
    } else {
      category = await Category.findOne({
        nameAlias: req.params.idOrAlias,
      });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const nameAlias = createNameAlias(name);

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!name || !nameAlias) {
      const existingCategory = await Category.findOne({
        $and: [
          { _id: { $ne: req.params.id } }, // Exclude current category
          {
            $or: [
              name ? { name: { $regex: new RegExp(`^${name}$`, "i") } } : {},
              nameAlias ? { nameAlias } : {},
            ],
          },
        ],
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category already exists",
        });
      }
    }
    if (name) {
      category.name = name;
    }
    if (nameAlias) {
      category.nameAlias = nameAlias;
    }
    await category.save();
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    await category.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
