import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from './../models/userModule.js'
import colors from 'colors'

export const protect = asyncHandler( async (req,res,next) => {
    let token

    // console.log(req.headers.authorization, ' auth middleware'.bgMagenta)

    if(
        req.headers.authorization 
        && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            token = req.headers.authorization.replace('Bearer ','')

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            res.status(401)
            throw new Error('YOU MORON! THIS IS NOT MY TOKEN DUMB!')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('AAAAAAsshole!! you have no token you ugly bastard')
    }
    }
)

export const isAdmin = (req, res, next) => {
    console.log('middleware isAdmin called');
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error('ADMINISTRATOR ONLY, you are not authorized')
    }
}