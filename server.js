const express = require('express');
const app = express();
const productosRouter = require('./routes/productos');

// Middleware para parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Rutas para productos (base: /odata/productos)
app.use('/odata/productos', productosRouter);

// Middleware para manejo de errores inesperados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor en puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}/odata/productos`);
});
