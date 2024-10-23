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
