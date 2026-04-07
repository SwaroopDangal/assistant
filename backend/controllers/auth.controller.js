import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";


export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: "Email already exist" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}