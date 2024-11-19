require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Define a Mongoose schema and model for the data
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// Middleware to parse JSON
app.use(express.json());

// Route to add data
app.post('/add', async (req, res) => {
  const { name, description } = req.body;

  try {
    const newItem = new Item({ name, description });
    await newItem.save();
    res.status(201).send('Item added successfully');
  } catch (err) {
    res.status(500).send('Error adding item');
  }
});

// Route to fetch data
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).send('Error fetching items');
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Node.js!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
