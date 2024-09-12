const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { faker } = require('@faker-js/faker');

const app = express();
const productsFilePath = path.join(__dirname, 'products.json');
const port = 3000;

app.use(cors({
  origin: '*',
  exposedHeaders: ['X-Total-Count'], // Add this line
}));

app.use(express.json());
// Utility Functions
async function readProductsFromFile() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return []; // Return an empty array if there's an issue reading the file
  }
}

async function writeProductsToFile(products) {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing to products file:', error);
  }
}

// Generate and save products to the file
async function generateAndSaveProducts(count) {
  const products = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    checked: faker.datatype.boolean(),
  }));

  await writeProductsToFile(products);
}

// Initial population of products (this will overwrite the file each time the server starts)
generateAndSaveProducts(50).then(r => {});

// Generating Fake Users with Predefined JWT Tokens
function generateUsers() {
  return [
    {
      id: "user1",
      password: "MTIzNA==", // Base64 for "1234"
      roles: ["USER"],
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTcwMDU2Njc1NywiZXhwIjoxNzYxMTExMTExLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0Ojg4ODgvYXV0aCIsIm5iZiI6MTcyMDU2Njc1NywiZmlyc3RuYW1lIjoiemFrYXJpYSIsImxhc3RuYW1lIjoiZWwgbW91bW5hb3VpIiwiZW1haWwiOiJ6YWthcmlhQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVTRVIiXX0.9tPw4bp5iEYA_D8_kv01OVLvEdQnhealvfjJOetltLI",
    },
    {
      id: "user2",
      password: "MTIzNA==",
      roles: ["USER"],
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMiIsImlhdCI6MTcwMDU2Njc1NywiZXhwIjoxNzYxMTExMTExLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0Ojg4ODgvYXV0aCIsIm5iZiI6MTcyMDU2Njc1NywiZmlyc3RuYW1lIjoiemFrYXJpYSIsImxhc3RuYW1lIjoiZWwgbW91bW5hb3VpIiwiZW1haWwiOiJ6YWthcmlhQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVTRVIiXX0.LXK-c0mA0gqXmtgpEoqzcXXQeEksTB7CGkJW1XTH0Y0",
    },
    {
      id: "admin",
      password: "MTIzNA==",
      roles: ["USER", "ADMIN"],
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwMDU2Njc1NywiZXhwIjoxNzYxMTExMTExLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0Ojg4ODgvYXV0aCIsIm5iZiI6MTcyMDU2Njc1NywiZmlyc3RuYW1lIjoiemFrYXJpYSIsImxhc3RuYW1lIjoiZWwgbW91bW5hb3VpIiwiZW1haWwiOiJ6YWthcmlhQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVTRVIiLCJBRE1JTiJdfQ.Uh1rvj0czXq0Ctx4EUB3jFtS98emSAOFESZVjaegR-Y",
    }
  ];
}

// Routes

// Get all products with pagination and optional search by name
// Get all products with pagination and optional search by name
app.get('/products', async (req, res) => {
  try {
    // Extract query parameters
    let { name_like, _page, _limit } = req.query;

    // Parse _page and _limit to integers, with default values
    const page = _page ? parseInt(_page, 10) : 1;
    const limit = _limit ? parseInt(_limit, 10) : 10;

    // Ensure page and limit are positive integers
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid page or limit value' });
    }

    let products = await readProductsFromFile();

    // Filter products based on search query if provided
    if (name_like) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(name_like.toLowerCase())
      );
    }

    // Calculate start and end indices for pagination
    const start = (page - 1) * limit;
    const end = start + limit;

    // Ensure that start does not exceed the array length
    if (start >= products.length) {
      return res.json([]); // Return an empty array if the page is out of bounds
    }

    // Set headers and return the paginated products
    res.setHeader('X-Total-Count', products.length);
    res.json(products.slice(start, end));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific product by ID
app.get('/products/:id', async (req, res) => {
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
app.post('/products', async (req, res) => {
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
app.put('/products/:id', async (req, res) => {
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

// Route to get all products without filters
app.get('/products', async (req, res) => {
  try {
    const products = await readProductsFromFile();

    // Send the complete list of products
    res.json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Partially update a product (e.g., checking/unchecking)
app.patch('/products/:id', async (req, res) => {
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
app.delete('/products/:id', async (req, res) => {
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
// Route to get a specific user by ID
app.get('/users/:id', (req, res) => {
  const users = generateUsers(); // Generate fake users
  const user = users.find(user => user.id === req.params.id); // Find user by ID
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' }); // Return 404 if user not found
  }
});

app.get('/users', (req, res) => {
  const users = generateUsers(); // Generate fake users
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
