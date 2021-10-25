const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const PDFDocument = require('pdfkit');
const path = require('path');
const auth = require("../middleware/auth");
const Images = require("../models/image");

// create new route
const api = new express.Router();

// file upload
const upload = multer({
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpe?g|png|)$/)) {
            return cb(new Error("Image extantion must be jpg/png/jpeg"))
        }
        cb(undefined, true)
    }
})


// Login
api.post("/login", async (req, res) => {
    try {
        if (req.body.email === process.env.EMAIL && req.body.password === process.env.PASSWORD) {
            
            const token = jwt.sign({ 
                email: process.env.EMAIL,
                password: process.env.PASSWORD
            }, process.env.SECRET_KEY);
            
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 86400000),
                httpOnly: true,
            });
            
            res.status(201).redirect("/");
        } else {
            res.status(400).send({
                error: "Invalid Credentials",
            });
        }
    } catch (error) {
        res.status(400).send({
            error: "Something went wrong in login, try again",
        });
    }
});


// add new Image
api.post("/add-image", auth, upload.single('image'), async (req, res) => {
    try {
        const image = new Images({
            image_name: req.body.imageName,
            image_type: req.body.imageType,
            image: req.file.buffer.toString('base64')
        });
        
        await image.save();
    
        res.status(201).redirect("/add-image");
    } catch (error) {
        res.status(400).send({
            error: "Something went wrong while uploading image, try again",
        });
    }
});


// delete selected images or create PDF
api.post("/selected_images", auth, async (req, res) => {
    
    // create pdf
    if (req.body.action === 'createPdf') {
        try {
            const images = await Images.find({ _id: req.body.images });

            const pdfDoc = new PDFDocument();
            // pdfDoc.pipe(fs.createWriteStream('Images.pdf'));
            
            pdfDoc.font('Times-Roman')
            .fontSize(18)
            .fillColor('black')
            .text('Mr. Ravi Gajeta', { align: 'left', lineBreak : false }, 20, 20)
            .fillColor('blue')
            .fontSize(12)
            .text('+91 98765 43210', { align: 'right', link: 'tel: 9876543210' });
            pdfDoc.moveDown(3)
            
            images.forEach((img, i) => {
                if (i%2 == 0 && i != 0) pdfDoc.addPage();
                
                pdfDoc
                .font('Times-Roman')
                .fontSize(15)
                .fillColor('black')
                .text(`${i+1}) ${img.image_name}`)
                .image(new Buffer(img.image, 'base64'), {width: 200, height: 200});
                pdfDoc.moveDown(5)
            })
            
            pdfDoc.end();
            pdfDoc.pipe(res);
        } catch (error) {
            res.status(400).send({
                error: "Something went wrong while creating PDF, try again",
            });
        }
    } 
    
    // delete images
    else if (req.body.action === 'deleteImages') {
        try {
            await Images.deleteMany({ _id: req.body.images });
            res.status(201).redirect("/");
        } catch (error) {
            res.status(400).send({
                error: "Something went wrong while deleteing Images, try again",
            });
        }
    }
});


// logout
api.get("/logout", auth, async (req, res) => {
    try {
        res.clearCookie("jwt");
        
        res.redirect("/login");
    } catch (error) {
        res.status(501).send(error);
    }
});


module.exports = api;
