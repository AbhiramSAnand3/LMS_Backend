import jwt from "jsonwebtoken"
import {config} from "dotenv"

config();

export const generateAuthToken = (id, role) => jwt.sign({id, role}, process.env.JWT_SECRET);