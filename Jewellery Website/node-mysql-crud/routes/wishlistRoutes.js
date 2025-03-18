const express = require("express");
const router = express.Router();
const db = require("../models/db"); // Ensure your database connection is correct

// Get all wishlist items
router.get("/", async (req, res) => {
    try {
        const [wishlist] = await db.execute("SELECT * FROM wishlist");
        res.json(wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Add an item to wishlist
router.post("/", async (req, res) => {
    try {
        const { product_id, name, price, image } = req.body;
        if (!product_id || !name || !price || !image) {
            return res.status(400).json({ message: "Missing fields" });
        }

        await db.execute(
            "INSERT INTO wishlist (product_id, name, price, image) VALUES (?, ?, ?, ?)",
            [product_id, name, price, image]
        );

        res.status(201).json({ message: "Added to wishlist" });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Remove an item from wishlist
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM wishlist WHERE id = ?", [id]);
        res.json({ message: "Removed from wishlist" });
    } catch (error) {
        console.error("Error deleting wishlist item:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
