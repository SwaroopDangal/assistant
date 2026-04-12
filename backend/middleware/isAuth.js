import jwt from "jsonwebtoken";
const isAuth = (req, res, next) => {
    try {
        console.log(req.cookies)
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Server Error" });
    }
};

export default isAuth;