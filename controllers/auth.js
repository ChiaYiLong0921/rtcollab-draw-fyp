const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken')



const register = async (req, res) =>{
    console.log(req.body);
    
    const user = await User.create({...req.body})
    const token = user.createJWT()
    console.log(StatusCodes.CREATED);
    res
    .status(StatusCodes.CREATED)
    .json({user:user, token:token})
}

const login = async (req, res) =>{
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError("Please provide email and password")
    }
    const user = await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:user, token:token})

}



module.exports = {
    register,
    login,
}