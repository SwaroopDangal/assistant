import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'



const uploadCoudinary = async (filePath) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    try {
        const result = await cloudinary.uploader.upload(filePath)
        fs.unlinkSync(filePath)
        return result.secure_url
    } catch (error) {
        fs.unlinkSync(filePath)
        console.log(error)
        return res.status(500).json({ message: "Error uploading image to Cloudinary", error: error.message })
    }


}

export default uploadCoudinary