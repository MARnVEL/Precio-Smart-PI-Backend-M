const Usuarios = require('../models/User.model');
const bcrypt = require('bcrypt');

const ctrlUser = {};

ctrlUser.getUsuarios = async (req, res) => {
    try {
        const users = await Usuarios.find();
        return res.status(200).json(users);
    
    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener usuarios'
        })
    }
};

ctrlUser.getUsuario = async (req, res) => {
    const idUser = req.params.id_user;
    try {
        const user = await Usuarios.findById(idUser);
        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            msg: 'Error al obtener el user'
        })
    }
};

ctrlUser.postUsuario = async (req, res) => {    
    const { username, password, email, rol } = await req.body;
    
    try {
        //Encriptar la contraseña
        const newPassword = bcrypt.hashSync(password, 10);

        const newUser = new Usuarios({   //Se instancia un nuevo documento de mongodb
            username,
            password: newPassword,
            email,
            rol
        });
    
        const user = await newUser.save(); //Se almacena en la base de datos con el metodo save()
    
        return res.status(200).json({
            msg: 'Usuario creado correctamente',
            user:{
                _id: user._id,
                username: user.username,
                email: user.email,
                rol: user.rol
            },
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Erro al crear un usuario',
            error:error.message
        });
    }
};

ctrlUser.putUsuarios = async (req, res) => {
    const userId = req.params.id_user;
    const { username, email, isActive, rol, ...otros } = req.body;

    try {
        const userUpdate = await Usuarios.findByIdAndUpdate(userId, { username, email, isActive, rol, ...otros });
        return res.status(200).json({
            msg: 'Usuario actualizado correctamente',

            user:{
                _id: userUpdate._id,
                username: userUpdate.username,
                email: userUpdate.email,
                rol: userUpdate.rol
            },
            //!Ojo acá esto lo cambié para que no me devuelva el valor de la contraseña
            // userUpdate
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al actualizar el usuario'
        });
    }
};

ctrlUser.deleteUsuario = async (req, res)=>{ 
    const userId = req.params.id_user;

    try {
        await Usuarios.findByIdAndUpdate(userId, {isActive: false})
        return res.status(200).json({
            msg: 'Usuario eliminado correctamente'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error al eliminar el usuario'
        });
    }
};

module.exports = ctrlUser