import Author from "../../model/lookups/authorModel.js";

export const createAuthor = async (req, res) => {
  const { name, bio, birthDate, deathDate, nationality, website } = req.body;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }

  try {
    const author = await Author.create({
      name,
      bio,
      birthDate,
      deathDate,
      nationality,
      website,
    });
    return res.status(201).json({
      success: true,
      message: "Author created successfully",
      data: author,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create author",
      error: error.message,
    });
  }
};

export const getAllAuthors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1;

    const searchQuery = req.query.search
      ? { $text: { $search: req.query.search } }
      : {};

    const authors = await Author.find(searchQuery)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalAuthors = await Author.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalAuthors / limit);

    return res.status(200).json({
      success: true,
      message: "Authors fetched successfully",
      data: authors,
      totalAuthors,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch authors",
      error: error.message,
    });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Author fetched successfully",
      data: author,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch author",
      error: error.message,
    });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const { name, bio, birthDate, deathDate, nationality, website } = req.body;
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }
    author.name = name || author.name;
    author.bio = bio || author.bio;
    author.birthDate = birthDate || author.birthDate;
    author.deathDate = deathDate || author.deathDate;
    author.nationality = nationality || author.nationality;
    author.website = website || author.website;
    await author.save();
    return res.status(200).json({
      success: true,
      message: "Author updated successfully",
      data: author,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update author",
      error: error.message,
    });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }
    await author.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Author deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete author",
      error: error.message,
    });
  }
};
