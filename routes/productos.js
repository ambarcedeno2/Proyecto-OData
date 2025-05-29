const express = require('express');
const router = express.Router();
const controller = require('../controllers/productoController');

/**
 * Define las rutas CRUD para productos,
 * delegando la lógica al controlador correspondiente.
 */
// CRUD básico

router.get('/', controller.listar); //Listar
router.get('/:id', controller.obtener); //Obtener
router.post('/', controller.crear); //Crear
router.put('/:id', controller.actualizar); //actualizar
router.delete('/:id', controller.eliminar); //eliminar

module.exports = router;



