const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
const User=require('../../model/userModel');
const { response } = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt=require('jsonwebtoken')

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })
}

const registerUser = asyncHandler(async (req,res)=>{
    const{name,email,phone,userName,password,gender}=req.body
    if(!name || !email || !phone || !userName || !password || !gender){
        res.status(400)
        throw new Error('Enter all feilds')
    }

    const userExist = await User.findOne({email})  || await User.findOne({phone})

    if(userExist)
    {
        res.status(400)
        throw new Error('email or phone already exist')
    }
 const checkUsername = await User.findOne({userName})
 
 if (checkUsername)
 {
    res.status(400)
    throw new Error('User name already exist')
 }

    //password hashing
    const salt = await bcrypt.genSalt(13)
    const hashedPassword = await bcrypt.hash(password,salt)

    const user= await User.create({
        name,
        email,
        phone,
        userName,
        password:hashedPassword,
        gender,


    }) 
    user.save()

    res.json({
        _id:user.id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        userName:user.userName,
        gender:user.gender,
        token:generateToken(user._id)
    })
})

const loginUser = asyncHandler(async (req,res)=>{

    const {email,password} = req.body
    const user = await User.findOne({email})
    
    if (user && (await bcrypt.compare(password,user.password))){

        res.json({
            _id:user.id,
            name:user.name,
            email:user.email,
             phone:user.phone,
             userName:user.userName,
            gender:user.gender,
             token:generateToken(user._id)

        })
    
    }
    else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

module.exports={
    registerUser,
    loginUser

}