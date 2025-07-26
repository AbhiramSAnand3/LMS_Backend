import Book from "../../model/bookModel.js";
import Author from "../../model/lookups/authorModel.js";
import Genre from "../../model/lookups/genreModel.js";
import Category from "../../model/lookups/categoryModel.js";
import Publisher from "../../model/lookups/publisherModel.js";
import _ from "mongoose-paginate-v2";
import {
  deleteImagesFromCloudinary,
  uploadImagesToCloudinary,
} from "../../utils/helper.js";

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sortField || "title";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1;

    const searchQuery = req.query.search
      ? {
          $or: [
            { title: { $regex: req.query.search, $options: "i" } },
            { isbn: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const books = await Book.find(searchQuery)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate("authors", "name ")
      .populate("publisher", "name")
      .populate("genre", "name")
      .populate("category", "name");

    const totalBooks = await Book.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalBooks / limit);

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books,
      totalBooks,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("authors", "name")
      .populate("publisher", "name")
      .populate("genre", "name")
      .populate("category", "name");
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error: error.message,
    });
  }
};

export const updateBook = async (req, res) => {
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
      imagesToDelete, // Array of publicIds to delete
    } = req.body;

    // Find the book
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Validate ISBN uniqueness if changed
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook && existingBook._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: "ISBN already exists",
        });
      }
    }

    // Check if authors exist if being updated
    if (authors) {
      const authorsExist = await Author.find({ _id: { $in: authors } });
      if (authorsExist.length !== authors.length) {
        return res.status(400).json({
          success: false,
          message: "One or more authors not found",
        });
      }
    }

    // Check if genre exists if being updated
    if (genre) {
      const genreExists = await Genre.findById(genre);
      if (!genreExists) {
        return res.status(400).json({
          success: false,
          message: "Genre not found",
        });
      }
    }

    // Check if category exists if being updated
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Check if publisher exists if being updated
    if (publisher) {
      const publisherExists = await Publisher.findById(publisher);
      if (!publisherExists) {
        return res.status(400).json({
          success: false,
          message: "Publisher not found",
        });
      }
    }

    // Handle image deletions
    if (imagesToDelete) {
      const publicIdsToDelete = JSON.parse(imagesToDelete);
      const imagesToKeep = book.images.filter(
        (img) => !publicIdsToDelete.includes(img.publicId),
      );

      // Delete images from Cloudinary
      const imagesToRemove = book.images.filter((img) =>
        publicIdsToDelete.includes(img.publicId),
      );
      await deleteImagesFromCloudinary(imagesToRemove);

      book.images = imagesToKeep;
    }

    // Upload new images if any
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = await uploadImagesToCloudinary(req.files);
      book.images.push(...newImages);
    }

    // Update book fields
    book.title = title || book.title;
    book.isbn = isbn || book.isbn;
    book.authors = authors || book.authors;
    book.publisher = publisher || book.publisher;
    book.publicationYear = publicationYear || book.publicationYear;
    book.edition = edition || book.edition;
    book.genre = genre || book.genre;
    book.category = category || book.category;
    book.language = language || book.language;
    book.pageCount = pageCount || book.pageCount;
    book.description = description || book.description;
    book.totalCopies = totalCopies || book.totalCopies;
    book.availableCopies = availableCopies || book.availableCopies;
    book.shelfLocation = shelfLocation || book.shelfLocation;
    book.tags = tags || book.tags;
    book.isReference =
      isReference !== undefined ? isReference : book.isReference;

    await book.save();

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Delete associated images from Cloudinary
    await deleteImagesFromCloudinary(book.images);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error: error.message,
    });
  }
};
