const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');
var administradoresSchema = Schema({
    user: {
		type: String,
		required: [true, "El usuario es obligatorio"],
		unique: true
	},
	password: {
		type: String,
		required: [true, "La contraseña es obligatoria"]
	}
});

administradoresSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

administradoresSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/*=============================================
Evitar devolver en la DATA el campo Password
=============================================*/

administradoresSchema.methods.toJSON = function(){

	let admin = this;
	let adminObject = admin.toObject();
	delete adminObject.password;

	return adminObject;

}

module.exports = mongoose.model("administradores", administradoresSchema);