import { createNameAlias } from "../../utils/helper.js";
import Genre from "../../model/lookups/genreModel.js";
import Category from "../../model/lookups/categoryModel.js";


export const createGenre = async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const nameAlias = createNameAlias(name);

        if(!name || !nameAlias) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            })
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
            data: await Genre.findById(genres._id).populate("category", "name nameAlias"),
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create genre",
            error: error.message,
        });
    }
};