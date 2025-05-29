// Simulación de base de datos en memoria con productos tecnológicos
let productos = require('../models/producto');

/**
 * Lista productos disponibles con soporte para filtro OData simple:
 * Permite usar ?$filter=precio gt 100, lt, ge, le, eq
 */
function listar(req, res) {
  let resultado = productos;
  const filtro = req.query['$filter'];

  if (filtro) {
    // Expresión regular para capturar filtros del tipo: precio gt 100
    const coincidencia = filtro.match(/precio (gt|lt|ge|le|eq) (\d+)/);

    if (coincidencia) {
      const [, operador, valor] = coincidencia;
      const precio = parseFloat(valor);

      resultado = productos.filter(p => {
        switch (operador) {
          case 'gt': return p.precio > precio;
          case 'lt': return p.precio < precio;
          case 'ge': return p.precio >= precio;
          case 'le': return p.precio <= precio;
          case 'eq': return p.precio === precio;
          default: return true;
        }
      });
    }
  }

  res.json(resultado);
}

/**
 * Obtiene un solo producto por su ID
 * Ruta: GET /odata/productos/:id
 */
function obtener(req, res) {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);
  if (!producto) return res.status(404).send({ error: 'No encontrado' });
  res.json(producto);
}

/**
 * Crea un nuevo producto
 * Ruta: POST /odata/productos
 */
function crear(req, res) {
  const nuevoProducto = req.body;

  if (!nuevoProducto.nombre || typeof nuevoProducto.precio !== 'number') {
    return res.status(400).send({ error: 'Datos inválidos' });
  }

  nuevoProducto.id = productos.length ? productos[productos.length - 1].id + 1 : 1;
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
}

/**
 * Actualiza un producto existente
 * Ruta: PUT /odata/productos/:id
 */
function actualizar(req, res) {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).send({ error: 'No encontrado' });

  const { nombre, precio } = req.body;
  if (!nombre || typeof precio !== 'number') {
    return res.status(400).send({ error: 'Datos inválidos' });
  }

  productos[index] = { id, nombre, precio };
  res.json(productos[index]);
}

/**
 * Elimina un producto
 * Ruta: DELETE /odata/productos/:id
 */
function eliminar(req, res) {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).send({ error: 'No encontrado' });

  const eliminado = productos.splice(index, 1);
  res.json({ mensaje: 'Producto eliminado', producto: eliminado[0] });
}

// Exportamos todas las funciones del controlador
module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};
