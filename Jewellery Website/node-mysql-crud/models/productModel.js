const db = require("./db");

const Product = {
    create: (name, image, description, price, discount_price, category, type, date, callback) => {
        db.query(
            "INSERT INTO products (name, image, description, price, discount_price, category, type, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [name, image, description, price, discount_price, category, type, date],
            callback
        );
    },

    getAll: (callback) => {
        db.query("SELECT * FROM products", callback);
    },

    getByType: (type, callback) => {
        db.query("SELECT * FROM products WHERE type = ?", [type], callback);
    },

    update: (id, name, image, description, price, discount_price, category, type, callback) => {
        db.query(
            "UPDATE products SET name=?, image=?, description=?, price=?, discount_price=?, category=?, type=? WHERE id=?",
            [name, image, description, price, discount_price, category, type, id],
            callback
        );
    },

    delete: (id, callback) => {
        db.query("DELETE FROM products WHERE id=?", [id], callback);
    }
};

module.exports = Product;
