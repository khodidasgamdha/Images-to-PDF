const express = require("express");
const cookieParser = require("cookie-parser");
const router = require("./routes/routes");
const api = require("./api/api");

const app = express();

require("dotenv").config(); // load dotenv
require("./db/connection"); // DB connection

app.set("view engine", "ejs"); // template

const port = process.env.PORT || 3000;

// work as middleware
app.use(express.json()); // convert Incoming JSON to Object
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(router);
app.use(api);

app.get('*', (req, res) => {
    res.render("404");
})

app.listen(port, () => {
    console.log(`🚀  Server ready at http://127.0.0.1:${port}`);
});