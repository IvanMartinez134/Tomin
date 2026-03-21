const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Base de datos simulada en memoria (se reinicia al reiniciar el servidor)
let users = [
  { id: 1, email: 'test@tomin.com', password: 'password123', name: 'Ángeles', plan: 'premium' }
];

let savingsBoxes = [
  { id: 'box-1', userId: 1, name: 'VIAJE A JAPÓN', icon: 'plane', goal: 50000, currentBalance: 6780 },
  { id: 'box-2', userId: 1, name: 'CARRO NUEVO', icon: 'car', goal: 120000, currentBalance: 4500 },
  { id: 'box-3', userId: 1, name: 'ENGANCHE DEPASA', icon: 'home', goal: 300000, currentBalance: 15300 },
  { id: 'box-4', userId: 1, name: 'FONDO EMERGENCIA', icon: 'health', goal: 20000, currentBalance: 20000 }
];

// --- RUTAS DE AUTENTICACIÓN ---

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Retornamos el usuario sin el password
    const { password, ...userData } = user;
    res.json({ success: true, user: userData, token: 'fake-jwt-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
});

// Registro
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'El correo ya está en uso' });
  }
  
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    plan: 'free'
  };
  
  users.push(newUser);
  
  const { password: _, ...userData } = newUser;
  res.status(201).json({ success: true, user: userData, token: 'fake-jwt-token-123' });
});

// --- RUTAS DE CAJAS DE AHORRO ---

// Obtener todas las cajas de un usuario
app.get('/api/boxes', (req, res) => {
  const userId = parseInt(req.query.userId) || 1; // Por defecto el usuario 1 si no se envía
  const userBoxes = savingsBoxes.filter(box => box.userId === userId);
  res.json({ success: true, data: userBoxes });
});

// Crear una caja nueva
app.post('/api/boxes', (req, res) => {
  const { userId, name, icon, goal } = req.body;
  
  const newBox = {
    id: 'box-' + Date.now(),
    userId: parseInt(userId) || 1,
    name: name.toUpperCase(),
    icon: icon || 'wallet',
    goal: parseFloat(goal) || 0,
    currentBalance: 0
  };
  
  savingsBoxes.push(newBox);
  res.status(201).json({ success: true, data: newBox });
});

// Depositar en una caja
app.post('/api/boxes/:id/deposit', (req, res) => {
  const boxId = req.params.id;
  const { amount } = req.body;
  
  const boxIndex = savingsBoxes.findIndex(b => b.id === boxId);
  
  if (boxIndex === -1) {
    return res.status(404).json({ success: false, message: 'Caja no encontrada' });
  }
  
  savingsBoxes[boxIndex].currentBalance += parseFloat(amount);
  
  res.json({ 
    success: true, 
    data: savingsBoxes[boxIndex],
    message: `Depósito de $${amount} exitoso` 
  });
});

// Retirar de una caja
app.post('/api/boxes/:id/withdraw', (req, res) => {
  const boxId = req.params.id;
  const { amount } = req.body;
  
  const boxIndex = savingsBoxes.findIndex(b => b.id === boxId);
  
  if (boxIndex === -1) {
    return res.status(404).json({ success: false, message: 'Caja no encontrada' });
  }
  
  if (savingsBoxes[boxIndex].currentBalance < parseFloat(amount)) {
    return res.status(400).json({ success: false, message: 'Fondos insuficientes' });
  }
  
  savingsBoxes[boxIndex].currentBalance -= parseFloat(amount);
  
  res.json({ 
    success: true, 
    data: savingsBoxes[boxIndex],
    message: `Retiro de $${amount} exitoso` 
  });
});

// Arrancar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('====================================');
  console.log(`🚀 Mock Backend para Tomin (Savings Boxes)`);
  console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`\nUsuarios de prueba:`);
  console.log(`- Email: test@tomin.com`);
  console.log(`- Password: password123`);
  console.log('====================================');
});
