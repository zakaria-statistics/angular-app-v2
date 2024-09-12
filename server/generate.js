const { faker } = require('@faker-js/faker');
const { writeProductsToFile } = require('./utils/products');

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
            roles: ["ADMIN"],
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwMDU2Njc1NywiZXhwIjoxNzYxMTExMTExLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0Ojg4ODgvYXV0aCIsIm5iZiI6MTcyMDU2Njc1NywiZmlyc3RuYW1lIjoiemFrYXJpYSIsImxhc3RuYW1lIjoiZWwgbW91bW5hb3VpIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlcyI6WyJBRE1JTiJdfQ.yBHZFXqSytZPUYXYgkJ6LgwoAvytnPjeLB5hEzqg8u0",
        },
    ];
}

module.exports = { generateAndSaveProducts, generateUsers };
