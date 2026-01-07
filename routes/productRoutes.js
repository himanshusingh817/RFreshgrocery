const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");

const router = express.Router();
const ADMIN_KEY = "81787822";

/* ===== MULTER CONFIG ===== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png") cb(null, true);
    else cb(new Error("Only PNG images allowed"));
  }
});

/* ===== GET PRODUCTS ===== */
router.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


router.post("/add-product", upload.single("img"), (req, res) => {
  const { name, mrp, price, key } = req.body;

  if (key !== "81787822")
    return res.status(403).json({ message: "Unauthorized" });

  if (!req.file)
    return res.status(400).json({ message: "Image required" });

  const imgPath = `/uploads/${req.file.filename}`;

  const sql = `
    INSERT INTO products (name, mrp, price, img)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, mrp, price, imgPath], err => {
    if (err) return res.status(500).json({ message: err });
    res.json({ message: "Product added successfully" });
  });
});


module.exports = router;
