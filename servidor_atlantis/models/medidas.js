var mongoose = require("mongoose");

var medidaSchema = new mongoose.Schema({
	
	medida: Number,
	date: Date
});

module.exports = mongoose.model("Medida", medidaSchema);