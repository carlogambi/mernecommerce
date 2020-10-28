import asyncHandler from 'express-async-handler'
import Product from './../models/productModel.js';
import generateToken from '../utils/generateToken.js';
import User from './../models/userModule.js'

//ROUTE DEL FILE -> api/user/login


// autorizza l'utente  e fornisce il token GET
// accesso public
// api/uers/login

export const authorizeUser = asyncHandler(async (req,res) =>{
    const { email, password } = req.body;
    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        res.json({
            ...user._doc,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error('you bitch! who are you???')
    }
})

//restituisce i dati dell'utente GET
//accesso privato
// api/users/profile

export const getUserProfile = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.user._id)
    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(404)
        throw new Error('user not found')
    }
})


// registra un nuovo utente POST
// accesso public 
// api/users/register

export const registerUser = asyncHandler(async (req,res) =>{
    const { email, password, name } = req.body;
    
    const userExist = await User.findOne({email})
    
    if(userExist){
        res.status(400)
        throw new Error('user altredy exist')
    }
    
    const user = await User.create({
        name,
        email, 
        password
    })
    
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('invalid user data')
    }
    
    
})

//restituisce i dati dell'utente GET
//accesso publico
// api/users/update

export const updateUserProfile = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.body._id)
    if(user){
        try{
        user.isAdmin = req.body.isAdmin || false
        user.name = req.body.name || user.name;
        user.password = req.body.password || user.password;
        
            user.favorites = req.body.favorites || user.favorites;
        
        if(req.body.password)user.email = req.body.email || user.email;
        console.log(JSON.stringify(req.body.favorites));
        const updatedUser= await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            favorites: updatedUser.favorites,
            token: generateToken(updatedUser._id)
        })
    }catch(e){console.log(e);}
    }else{
        res.status(404)
        throw new Error('user not updated') 
    }
})


//restituisce gli utenti amministratori GET
//accesso privato
// api/users/
export const getAdminUsers = asyncHandler(async (req,res) =>{
    
    
    const users = await User.find({});
    
    res.json(users)
})

//elimina un utente
//accesso privato
// api/users/delete/:id
export const deleteUser = asyncHandler(async (req,res) =>{
    
    let usrToDel = req.params.id
    usrToDel = await User.findById(usrToDel)
    if(usrToDel){
        await usrToDel.remove()
        res.json({message: 'user removed'})
    }else{
        res.status(404)
        throw new Error('user not fouuuuuuunnd')
    }
})

//ritorna un utente
//accesso privato
// api/users/getById/:id
export const getUserById = asyncHandler(async (req,res) =>{

    const userId = req.params.id

    const user = await User.findById(userId)

    if(user){
        res.json(user)
    }else{
        res.send(404)
        throw new Error('user not fouuuuuuund')
    }

})

//restituisce i commenti dell'utente GET
//accesso privato
// api/users/profile

export const getUserReviews = asyncHandler(async (req,res) =>{
    try{
    const products = await Product.find()

    let filtered = [];

    products.forEach(p => {
        if(p.reviews.length > 0){
            const currentUserReviews = p.reviews.filter(r => {
                return (r.userId == req.user.id)
            });
            filtered.push({
                userReviews: currentUserReviews,
                productId: p._id,
                productName: p.name
            })
        }
    })

    res.json(filtered)}catch(e){
        res.send(404)
        throw new Error('user not found')
    }
})

//restituisce i commenti dell'utente GET
//accesso privato
// api/users/profile

export const deleteUserReviews = asyncHandler(async (req,res) =>{

    try{
        const product = await Product.findById(req.params.productId)
        product.reviews = product.reviews.filter(r => r._id != req.params.reviewId)
        await product.save()
        res.send('success')
}catch(e){
        res.send(404)
        throw new Error('user not found')
    }
})