import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  created_date: Date,
  image: String,
  telephone: {
    type: Number,
  },
  company_name: {
    type: String,
  },
  company_address: String,
  company_city: String,
  company_region: String,
  company_country: String,
  is_verified: {
    type: Boolean,
    default: false,
  },
  forgot_password_token: String,
  forgot_password_token_expiry: Date,
  verify_token: String,
  verify_token_expiry: Date,
});

UserSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) return next(saltError);

      bcrypt.hash(user.password!, salt, function (hashError, hash) {
        if (hashError) return next(hashError);

        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (
  password: string,
  callback: Function
) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) return callback(error);

    callback(null, isMatch);
  });
};

UserSchema.statics.findExistingUser = async function (
  username: string,
  email: string
) {
  return await this.findOne({
    $or: [{ username }, { email }],
  });
};

UserSchema.statics.findUser = async function (usernameOrEmail: string) {
  return await this.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
};

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
