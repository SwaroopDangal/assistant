import uploadCoudinary from "../config/cloudinary.js";
import User from "../models/user.models.js";
import geminiResponse from "../gemini.js";
import moment from "moment";

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


export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await User.findById(req.userId).select("-password");
        user.history.push(command)
        user.save()
        const { name, assistantName, assistantImage } = user;
        const result = await geminiResponse(command, assistantName, name);

        const jsonMatch = result.match(/{[\s\S]*}/)
        if (!jsonMatch) {
            return res.status(200).json({ message: "No valid JSON response from assistant" });
        }
        let gemResult = JSON.parse(jsonMatch[0]);
        const type = gemResult.type;
        switch (type) {
            case 'get-date':
                return res.status(200).json({ type, userInput: gemResult.userInput, response: `Today is ${moment().format('YYYY-MM-DD')}` });
            case 'get-time':
                return res.status(200).json({ type, userInput: gemResult.userInput, response: `The time is ${moment().format('HH:mm:A')}` });
            case 'get-day':
                return res.status(200).json({ type, userInput: gemResult.userInput, response: `Today is ${moment().format('dddd')}` });
            case 'get-month':
                return res.status(200).json({ type, userInput: gemResult.userInput, response: `Today is ${moment().format('MMMM')}` });
            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'general':
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
                return res.status(200).json({ type, userInput: gemResult.userInput, response: gemResult.response });

            default:
                return res.status(200).json({ type, userInput: gemResult.userInput, response: "Assistant response received but type is unrecognized" });
        }


    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error in ask to assistant" });
    }
}