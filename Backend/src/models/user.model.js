const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'artist'],
        default: 'user',
    },

});

// ===== ADD THESE TWO BLOCKS =====

// (1) Anyone who registers is ALWAYS a normal user, even if the request says role: "artist"
userSchema.pre("validate", function () {
    if (this.isNew) this.role = "user";
});

// (2) The database allows only ONE artist
userSchema.index({ role: 1 }, { unique: true, partialFilterExpression: { role: "artist" } });

const userModel = mongoose.model('user', userSchema)

module.exports = userModel;