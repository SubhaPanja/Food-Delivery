import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch =await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const role=user.role;
    const token = createToken(user._id);
    res.json({ success: true, token,role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create token

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // checking user is already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // hashing user password

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const role=user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     // checking if user already exists
//     const exists = await userModel.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }

//     // validate email
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ success: false, message: "Please enter a valid email" });
//     }

//     // validate password
//     if (password.length < 8) {
//       return res.status(400).json({ success: false, message: "Please enter a strong password" });
//     }

//     // hash the password
//     const salt = await bcrypt.genSalt(Number(process.env.SALT));
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // use insertOne with mongoose.collection
//     const result = await userModel.collection.insertOne({
//       name,
//       email,
//       password: hashedPassword,
//       role: "user",     // add default role manually
//       cartData: {}      // add default cartData manually
//     });

//     // insertOne returns insertedId
//     const insertedId = result.insertedId;
//     const token = createToken(insertedId);
//     res.status(201).json({ success: true, token, role: "user" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


export { loginUser, registerUser };
