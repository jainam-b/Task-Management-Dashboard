import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the TypeScript interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  emailVerified?: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  image: { type: String },
  emailVerified: { type: Date },
});

// Hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
