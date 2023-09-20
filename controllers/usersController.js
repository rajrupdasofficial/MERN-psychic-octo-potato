const User = require('../models/User')
const Note = require('../models/Note')
const ayncHandler=require('express-async-handler')
const bcrypt = require('bcrypt')
const { response } = require('express')

//@desc Get all user
// @route GET /users
// @access Private

const getAllUsers = ayncHandler(async(req,res)=>{
    // getting users data with out password and all of those extra using select filter and lean is for not return any bullshits that typically a mongoose returnes
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message:'No users found'})
    }
    res.json(users)

})

//@desc create new users
// @route POST /users
// @access Private

const createNewUser = ayncHandler(async(req,res)=>{
    const {username,password,roles}=req.body
    //confirm data
    if (!username||!password||!Array.isArray(roles)||!roles?.length){
        return res.status(400).json({message:"All fields are required"})

    }
    // check for duplicates
    const duplicate = await User.findOne({username}).lean().exec()//if we are using async we have to use exec according to mongodb documentation
    if (duplicate){
        return res.status(409).json({message:"Duplicate Username"})
    }
    // Hash the password
    const hashedPwd = await bcrypt.hash(password,10)//salt rounds
    const userObject = {username,"password":hashedPwd,roles}

    //Create and store new yser
    const user = await User.create(userObject)
    if(user){
        // created
        res.status(201).json({message:`New user ${username} created`})
    }else{
        res.status(400).json({message:"Invalid User data received"})
    }
})

//@desc update new users
// @route PATCH /users
// @access Private

const updateUser = ayncHandler(async(req,res)=>{
    const {id,username,roles,active,password}= req.body
    //confirm data
    if(!id||!username||!Array.isArray(roles)||!roles.length||typeof active !='boolean'){
        return res.status(400).json({message:"All fields are required"})
    }
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({message:"User not found"})
    }

    //duplicate check
    const duplicate = await User.findOne({username}).lean().exec()
    //Allow updates to original user
    if (duplicate && duplicate?._id.toString()!==id){
            return res.status(409).json({message:"Duplicate username detected"})
    }
    user.username = username
    user.roles = roles
    user.active = active

    if(password){
        // hash password
        user.password = await bcrypt.hash(password, 10)
    }
    const updatedUser = await user.save()
    res.json({message:`${updateUser.username} update`})
})

//@desc delete new users
// @route PATCH /users
// @access Private

const deleteUser = ayncHandler(async(req,res)=>{
    const{id}=req.body;
    if(!id){
        return res.status(400).json({message:"user id is required"})
    }
    const notes = await Note.findOne({user:id}).lean().exec()
    if(notes?.length){
        return res.status(400).json({message:'User has assigned Notes'})
    }
    const user = await User.findById(id).exec()
    if (!user){
        return res.status(400).json({message:'User not found'})
    }
    const result = await user.deleteOne()
    const reply = `username ${result.username} with ID ${result._id} deleted`

    res.json(reply)

})

module.exports={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}