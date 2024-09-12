const express = require('express');
const router = express.Router();
const { readProductsFromFile, writeProductsToFile } = require('../utils/products');

// Get all products with pagination and optional search by name
router.get('/', async (req, res) => {
  try {
    const { name_like, _page = 1, _limit = 10 } = req.query;
    let products = await readProductsFromFile();

    if (name_like) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(name_like.toLowerCase())
      );
    }

    const page = _page;
    const limit = _limit;
    const start = (page - 1) * limit;
    const end = start + limit;

    res.setHeader('X-Total-Count', products.length); // Total count for pagination
    res.json(products.slice(start, end)); // Return paginated products
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const products = await readProductsFromFile();
    const product = products.find(p => p.id === productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, checked } = req.body;

    if (!name || !description || typeof price !== 'number' || typeof checked !== 'boolean') {
      return res.status(400).json({ error: 'Invalid product data' });
    }

    const products = await readProductsFromFile();
    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      name,
      description,
      price,
      checked
    };

    products.push(newProduct);
    await writeProductsToFile(products);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding new product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing product
router.put('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const products = await readProductsFromFile();
    const index = products.findIndex(p => p.id === productId);

    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      await writeProductsToFile(products);
      res.json(products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Partially update a product (e.g., checking/unchecking)
router.patch('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const products = await readProductsFromFile();
    const index = products.findIndex(p => p.id === productId);

    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      await writeProductsToFile(products);
      res.json(products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error partially updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const products = await readProductsFromFile();
    const filteredProducts = products.filter(p => p.id !== productId);

    if (products.length !== filteredProducts.length) {
      await writeProductsToFile(filteredProducts);
      res.status(204).send(); // No content status after successful deletion
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
