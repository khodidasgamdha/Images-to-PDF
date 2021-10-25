const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        if (
            verifyToken.email === process.env.EMAIL &&
            verifyToken.password === process.env.PASSWORD
        ) {
            next();
        } else {
            res.status(401).redirect("/login");
        }
    } catch (error) {
        res.status(401).redirect("/login");
    }
};

module.exports = auth;
