const mongoose = require("mongoose");

mongoose
    .connect(process.env.DB_NAME, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    });
