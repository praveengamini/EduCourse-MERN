import { Schema, model } from "mongoose";

const deviceSchema = new Schema({
  browser: String,
  os: String,
  time: { type: Date, default: Date.now },
  token: String,
});

const UserSchema = new Schema({
  userName: {
    type: String,required: true,unique: true,
  },
  email: {type: String,required: true,unique: true,
  },
  password: {type: String,required: true,
  },
  role: { type: String,default: "user",
  },
  devices: [deviceSchema],
});

const User = model("User", UserSchema);
export default User;
