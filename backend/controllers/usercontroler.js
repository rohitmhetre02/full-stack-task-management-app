import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import Validator from "validator"
import bodyParser from "body-parser";
const { json } = bodyParser;





// login user
const loginUser = async (req, res) => {
    const {email,password} = req.body;
    try{
        const user =await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"user Doesn't exist"})
        }
     
        const isMatch = await bcrypt.compare(password,user.password);
          
        if(!isMatch){
            return res.json({success:false,message:"Invalid"});
        }

        const token = createToken(user._id);
        res.json({success:true,token})

    }
   catch(error){
   console.log(error);
    res.json({success:false,message:"Error"})
   }
}

const createToken =(id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }
        if (!Validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a Strong password" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedpassword
        })

        const user = await newUser.save();
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
      console.log(error);
      res.json({success:false,message:"error"});
    }
}

export { loginUser, registerUser };
