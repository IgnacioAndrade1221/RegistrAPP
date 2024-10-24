const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Permite las solicitudes CORS
app.use(bodyParser.json()); // Parsear JSON

// Almacenamiento en memoria para usuarios
let users = []; // Aquí se guardarán los usuarios registrados

// Endpoint de registro
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  // Validar que todos los campos están presentes
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Verificar si el email ya está en uso
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'El email ya está en uso' });
  }

  // Agregar el nuevo usuario al arreglo
  users.push({ username, email, password });
  console.log(`Registrando usuario: ${username}, Email: ${email}`); // Para depuración

  // Respuesta de éxito
  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Endpoint de inicio de sesión
app.post('/api/login', (req, res) => {
  const { username, password } = req.body; // Cambié aquí a 'username'

  // Asegúrate de que 'username' y 'password' no sean undefined
  if (!username || !password) {
    console.error('Credenciales faltantes');
    return res.status(400).json({ message: 'Credenciales faltantes' });
  }

  // Buscar al usuario por nombre de usuario y contraseña
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    console.log(`Inicio de sesión exitoso para el usuario: ${user.username}`);
    return res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } else {
    console.error(`Error de inicio de sesión: credenciales incorrectas para ${username}`);
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

// Endpoint para obtener todos los usuarios
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API está funcionando correctamente' });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
// Endpoint para cambiar la contraseña
app.post('/api/change-password', (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  // Validar que los campos estén presentes
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Buscar al usuario por nombre de usuario
  const user = users.find(u => u.username === username);

  // Verificar si el usuario existe y la contraseña antigua es correcta
  if (!user || user.password !== oldPassword) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  // Actualizar la contraseña del usuario
  user.password = newPassword;
  console.log(`Contraseña actualizada para el usuario: ${user.username}`);

  // Respuesta de éxito
  res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
});