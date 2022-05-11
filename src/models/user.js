const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    faculty:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Faculty'
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ]
  },
  {
    timestamps: true,
  }
);


userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString()}, process.env.secret_key);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};



userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Invalid email addresss. Sign up instead.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Wrong email or password");
  }

  return user;
};



userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});



const User = mongoose.model("User", userSchema);

module.exports = User;
