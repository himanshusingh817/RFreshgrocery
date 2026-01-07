 const db = require("../config/db");

exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
};

// Secured Add Product
exports.addProduct = (req, res) => {
  const { name, price, img, key } = req.body;

  // Check admin key
  if (key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized: Admin only" });
  }

  if (!name || !price) return res.status(400).json({ message: "Fill all fields" });

  db.query(
    "INSERT INTO products (name, price, img) VALUES (?, ?, ?)",
    [name, price, img],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Insert failed" });
      res.json({ message: "Product added", id: result.insertId });
    }
  );
};
