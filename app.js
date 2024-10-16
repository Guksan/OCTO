const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Simulace databáze
let fuelTypes = [
  { id: 1, name: 'Natural 95', price: 33.50, stock: 5000 },
  { id: 2, name: 'Diesel', price: 32.20, stock: 4000 },
];

let transactions = [];

app.use(bodyParser.json());

// GET endpoint pro získání typů paliv
app.get('/fuel-types', (req, res) => {
  res.json(fuelTypes);
});

// POST endpoint pro provedení transakce
app.post('/transaction', (req, res) => {
  const { fuelTypeId, amount } = req.body;
  const fuelType = fuelTypes.find(f => f.id === fuelTypeId);

  if (!fuelType) {
    return res.status(404).json({ error: 'Fuel type not found' });
  }

  if (fuelType.stock < amount) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  const transaction = {
    id: transactions.length + 1,
    fuelTypeId,
    amount,
    totalPrice: fuelType.price * amount,
    timestamp: new Date()
  };

  fuelType.stock -= amount;
  transactions.push(transaction);

  res.status(201).json(transaction);
});

// GET endpoint pro získání transakcí
app.get('/transactions', (req, res) => {
  res.json(transactions);
});

app.listen(port, () => {
  console.log(`Fuel station API running on port ${port}`);
});