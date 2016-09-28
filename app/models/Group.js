
//require dependencies
const app = require('express')(),
      mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(process.env.DB_URI);
autoIncrement.initialize(connection);

//define schema
const groupSchema = new Schema({
    _id: Number,
    name: { type: String, required: true },
    //users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    users: [{ type: Number, ref: 'User' }]
});

groupSchema.plugin(autoIncrement.plugin, {
    model: 'Group',
    field: '_id',
    startAt: 0,
    incrementBy: 1
});

//export model
module.exports = mongoose.model('Group', groupSchema);
