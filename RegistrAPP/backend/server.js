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
  const { username, email, password, rol } = req.body;

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
  users.push({ username, email, password, rol });
  console.log(`Registrando usuario en memoria: ${username}, Email: ${email}, Rol: ${rol}`);

  // Ahora, hacer una petición HTTP a Django para registrar al usuario en su base de datos
  try {
    const response = await axios.post('http://192.168.100.10:8000/django-api/register/', {
      username,
      email,
      password,
      rol
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error al registrar en Django:', error);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error al registrar en Django' });
  }
});

// Endpoint de inicio de sesión
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Credenciales faltantes' });
  }

  try {
    // Llamada al backend de Django para validar el login
    const response = await axios.post('http://192.168.100.10:8000/django-api/login/', {
      username,
      password,
    });

    // Si el backend de Django responde con éxito
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error al autenticar en Django:', error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error al autenticar en Django' });
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
const HOST = '0.0.0.0'; // Escucha en todas las interfaces de red

app.listen(PORT, HOST, () => {
  const os = require('os'); // Importa el módulo os para obtener la IP local
  const networkInterfaces = os.networkInterfaces();
  
  // Encuentra la IP local de la red Wi-Fi (o LAN)
  const localIP = Object.values(networkInterfaces)
    .flat()
    .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;

  console.log(`Servidor ejecutándose en http://${localIP || HOST}:${PORT}`);
});