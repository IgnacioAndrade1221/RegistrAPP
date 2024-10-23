const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
app.use(cors()); // Permite las solicitudes CORS
app.use(bodyParser.json()); // Parsear JSON

// Endpoint de registro
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  // Aquí deberías agregar la lógica para guardar el usuario en la base de datos.
  console.log(`Registrando usuario: ${username}, Email: ${email}`); // Para depuración

  // Respuesta de éxito
  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users'; // Cambia esto según la estructura de tu tabla
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener usuarios' });
      }
      res.status(200).json(results);
    });
  });
  