const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(cors()); 
app.use(bodyParser.json()); 

// usuarios
let users = []; 

// endpoint
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // verificar email
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'El email ya está en uso' });
  }

 
  users.push({ username, email, password });
  console.log(`Registrando usuario: ${username}, Email: ${email}`); 

  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// endpoint  inicio sesión
app.post('/api/login', (req, res) => {
  const { username, password } = req.body; 

  if (!username || !password) {
    console.error('Credenciales faltantes');
    return res.status(400).json({ message: 'Credenciales faltantes' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    console.log(`Inicio de sesión exitoso para el usuario: ${user.username}`);
    return res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } else {
    console.error(`Error de inicio de sesión: credenciales incorrectas para ${username}`);
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

// Endpoint obtener usuarios
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API está funcionando correctamente' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
//  cambiar contraseña
app.post('/api/change-password', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const user = users.find(u => u.username === username);

  if (!user || user.password !== oldPassword) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  user.password = newPassword;
  console.log(`Contraseña actualizada para el usuario: ${user.username}`);

  res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
});