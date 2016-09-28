
//require dependencies
const app = require('express')(),
      mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(process.env.DB_URI);
autoIncrement.initialize(connection);

//define schema
const userSchema = new Schema({
    _id: Number,
    name: { type: String, required: true },
    email: { type: String, required: true },
    //groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }]
    groups: [{ type: Number, ref: 'Group' }]
});

userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: '_id',
    startAt: 0,
    incrementBy: 1
});

//export model
module.exports = mongoose.model('User', userSchema);
