const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Cliente HTTP

const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

// Usuarios en memoria (actualmente)
let users = []; 

// Endpoint de registro
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validaciones locales
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Verificar si el email ya está registrado (en memoria, por ahora)
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'El email ya está en uso' });
  }

  // Guardar usuario en memoria (Node.js)
  users.push({ username, email, password });
  console.log(`Registrando usuario en memoria: ${username}, Email: ${email}`);

  // Ahora, hacer una petición HTTP a Django para registrar al usuario en su base de datos
  try {
    const response = await axios.post('http://127.0.0.1:8000/django-api/register/', {
      username,
      email,
      password,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error al registrar en Django:', error);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error al registrar en Django' });
  }
});

// Endpoint de inicio de sesión
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

// Test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API está funcionando correctamente' });
});

// Cambiar contraseña
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

// Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});


app.use(cors({
  origin: 'http://localhost:8100'  // Permite solicitudes solo desde este origen
}));
