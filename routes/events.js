/**
 * Rutas de eventos
 * host + /api/events
 */


const { Router } = require('express');
const router = Router();

const { isDate } = require('../helpers/isDate');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

router.use(validarJWT); // De esta manera no tengo que colocar el validarJWT en cada una de las rutas de este archivo, y se aplica a todas las que estan despues de aca!

/*
Ejemplo: Si fuera asi, entonces validarJWT solo va a ser aplicado para actualizarEvento y eliminarEvento

router.get('/', getEventos);
router.post('/', crearEvento);
router.use(validarJWT);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);
*/

router.get('/', getEventos);

router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento
);

router.put('/:id',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports = router;