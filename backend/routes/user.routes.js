import express from "express";
import { getCurrentUser, updateAssistant } from "../controllers/user.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.get("/current", isAuth, getCurrentUser);
router.put("/update-assistant", isAuth, upload.single("assistantImage"), updateAssistant);


export default router