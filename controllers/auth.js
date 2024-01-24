const { response } = require('express'); // es opcional, pero es para tener el tipado e intellisense
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwk');

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo!'
            });
        }

        usuario = new Usuario(req.body);

        // Encriptar contrasena:
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar nuestro JWK
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador'
        })
    }
};

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(500).json({
                ok: false,
                msg: 'El usuario y contrasena no correcto'
            });
        }

        //Confirmar password
        const validarPassword = bcrypt.compareSync(password, usuario.password);

        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta'
            });
        }

        // Generar nuestro JWK
        const token = await generarJWT(usuario.id, usuario.name);

        return res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });



    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador del sistema'
        });
    }
};

const revalidarToken = async (req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    //Generar un nuevo JWT
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    })
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};