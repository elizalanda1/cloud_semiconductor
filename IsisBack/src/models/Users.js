import { Schema,model } from "mongoose";


const UserSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Admin', 'Inspector'],  // Definir roles si es necesario
      default: 'Inspector'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const User = model('User', UserSchema);
  export default User;
  