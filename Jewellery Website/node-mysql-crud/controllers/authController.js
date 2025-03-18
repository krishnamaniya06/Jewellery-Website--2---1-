const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = async (req, res) => {
    const { email, password, role = "customer" } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    User.create(email, hashedPassword, role, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully" });
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = user.role === "admin" ? jwt.sign({ id: user.id }, "your_secret_key", { expiresIn: "1h" }) : null;
        
        res.json({
            message: `Welcome, ${user.email}!`,
            token
        });
    });
};
