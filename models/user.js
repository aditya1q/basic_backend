import mongoose from "mongoose";

mongoose.connect(`mongodb://localhost:27017/api`);

const userSchema = mongoose.Schema({
    name: String,
    email: String
});

const user = mongoose.model('user', userSchema);

export default user;