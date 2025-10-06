const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/product');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB! 🚀');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// --- CRUD Routes ---

// CREATE: Add a new product
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ message: 'Error creating product', error: error.message });
    }
});

// READ: Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching products', error: error.message });
    }
});

// UPDATE: Update a product by its ID
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send({ message: 'Error updating product', error: error.message });
    }
});

// DELETE: Delete a product by its ID
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting product', error: error.message });
    }
}); 
