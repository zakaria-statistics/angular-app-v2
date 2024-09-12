const fs = require('fs-extra');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', '..', 'data', 'products.json');

async function readProductsFromFile() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

async function writeProductsToFile(products) {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing to products file:', error);
  }
}

module.exports = { readProductsFromFile, writeProductsToFile };
