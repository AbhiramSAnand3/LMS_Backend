import Book from "../../model/bookModel.js";
import Author from "../../model/lookups/authorModel.js";
import Genre from "../../model/lookups/genreModel.js";
import Category from "../../model/lookups/categoryModel.js";
import Publisher from "../../model/lookups/publisherModel.js";
import _ from "mongoose-paginate-v2";
import { uploadImagesToCloudinary } from "../../utils/helper.js";
import { v2 as cloudinary } from "cloudinary";

export const createBook = async (req, res) => {
  try {
    const {
      title,
      isbn,
      authors,
      publisher,
      publicationYear,
      edition,
      genre,
      category,
      language,
      pageCount,
      description,
      totalCopies,
      availableCopies,
      shelfLocation,
      tags,
      isReference,
    } = req.body;

    // Validate required fields
    if (!title || !isbn || !authors || !genre || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, ISBN, authors, genre, and category are required",
      });
    }

    // Check if genre exists
    const genreExists = await Genre.findById(genre);
    if (!genreExists) {
      return res.status(400).json({
        success: false,
        message: "Genre not found",
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if publisher exists (if provided)
    if (publisher) {
      const publisherExists = await Publisher.findById(publisher);
      if (!publisherExists) {
        return res.status(400).json({
          success: false,
          message: "Publisher not found",
        });
      }
    }

    // Check if ISBN is unique
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "ISBN already exists",
      });
    }

    // Upload images to Cloudinary if any
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await uploadImagesToCloudinary(req.files);
    }

    // Create new book
    const book = new Book({
      title,
      isbn,
      authors,
      publisher,
      publicationYear,
      edition,
      genre,
      category,
      language,
      pageCount,
      description,
      images,
      totalCopies,
      availableCopies: availableCopies || totalCopies || 1,
      shelfLocation,
      tags,
      isReference,
    });

    await book.save();

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: error.message,
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.paginate({}, { page: req.query.page || 1 });
    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};
