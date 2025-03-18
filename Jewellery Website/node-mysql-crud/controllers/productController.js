const Product = require("../models/productModel");

exports.createProduct = (req, res) => {
    const { name, image, description, price, discount_price, category, type, date } = req.body;

    if (!name || !image || !description || !price || !category || !type) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // If date is not provided, use the current date in YYYY-MM-DD format
    const formattedDate = date ? date : new Date().toISOString().split('T')[0];

    Product.create(name, image, description, price, discount_price, category, type, formattedDate, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "Product added successfully" });
    });
};

exports.getAllProducts = (req, res) => {
    Product.getAll((err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
};

exports.getProductsByType = (req, res) => {
    const { type } = req.params;

    Product.getByType(type, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, image, description, price, discount_price, category, type } = req.body;

    Product.update(id, name, image, description, price, discount_price, category, type, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Product updated successfully" });
    });
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    Product.delete(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Product deleted successfully" });
    });
};
