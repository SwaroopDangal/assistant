import uploadCoudinary from "../config/cloudinary.js";
import User from "../models/user.models.js";
export const getCurrentUser = async (req, res) => {
    try {
        const { userId } = req
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage;
        if (req.file) {
            assistantImage = await uploadCoudinary(req.file.path)
        } else {
            assistantImage = imageUrl
        }
        const user = await User.findByIdAndUpdate(req.userId, {
            assistantName,
            assistantImage
        },
            { new: true }
        ).select("-password");

        return res.status(200).json({ user });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error in update assistant" });
    }
}