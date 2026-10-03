const User = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenBlacklistModel = require('../model/blacklist.model');

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
const registerUserController = async(req,res)=>{
    try{
        const {username,email,password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({
                message : "Please enter username or email or password"
            });
        }

        const isUserAlreadyExist = await User.findOne({
            $or : [{username},{email}]
        });

        if(isUserAlreadyExist){
            return res.status(400).json({
                message : "User with this username or email already exists!! Please try with another"
            })
        }
        //hashing the password with bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
            username,
            email,
            password : hashedPassword
        });

        //creating the token
        const token = await jwt.sign(
            {id : user._id,username : user.username},
            process.env.JWT_SECRET_KEY,
            {expiresIn : "1d"}
        )

        res.cookie("token",token);

        res.status(201).json({
            message : "User is registered successfully!!!",
            user : {
                id : user._id,
                username : user.username,
                email : user.email
            }
        });

    }catch(e){
        console.log("Error in registering the user ",e);
        res.status(500).json({
            message : "Something went wrong!!! User not registered!!!"
        }); 
    }
}

/**
 * @name loginUserController
 * @description login a  user, expects email and password in the request body
 * @access Public
 */

const loginUserController = async(req,res)=>{
    try{
        const {email,password} = req.body;
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message : "User with this email is not found!! Please try again"
            });
        }
        //password match
        const isValidPassword = await bcrypt.compare(password,user.password);

        if(!isValidPassword){
            return res.status(400).json({
                message : "Invalid password!!!!"
            });
        }

        const token = jwt.sign(
            {id : user._id, username : user.username},
            process.env.JWT_SECRET_KEY,
            {expiresIn : "1d"}
        );
        res.cookie("token",token);
        res.status(200).json({
            message: "User loggedIn successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    }catch(e){
        console.log("Error in logging the user ",e);
        res.status(500).json({
            message : "Something went wrong!!! User not loggedin!!!"
        }); 
    }
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add in the blacklist
 * @access Public
 */

const logoutUserController = async(req,res) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({
                message : "User is not logged in please login first"
            });
        }
        if(token){
            await TokenBlacklistModel.create({token})
        }

        res.clearCookie("token");
        res.status(200).json({
            message : "User logged out successfully"
        });

    }catch(e){
        console.log("Error--->",e);
        
        req.status(500).json({
            message : "Error in loging out!!! Please try again"
        })
    }
}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access private
 */
const getMeController = async(req,res) => {
    try{
        const user = await User.findById(req.user.id);
        res.status(200).json({
            message : "User details fetched successfully!!!",
            user : {
                id : user._id,
                username : user.username,
                email : user.email
            }
        })

    }catch(e){
        res.status(500).json({
            message : "Error in getting the details"
        })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController

}