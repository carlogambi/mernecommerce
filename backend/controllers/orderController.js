import asyncHandler from 'express-async-handler'
import Order from './../models/orderModule.js'
import jwt from 'jsonwebtoken'
import User from '../models/userModule.js'


//ROUTE DEL FILE -> api/orders


// POST crea un nuovo ordine
// accesso privato

export const addOrderItems = asyncHandler(async (req,res) =>{
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,  
    } = req.body

 
    if(orderItems && (orderItems.length === 0)){
        res.status(400)
        throw new Error('order cart is FUCKIN EMPTY!!!!!!')
    }else{
        try{
        const order = new Order(
            {
                orderItems , 
                shippingAddress, 
                paymentMethod, 
                itemsPrice, 
                taxPrice, 
                shippingPrice, 
                totalPrice,  
                user: req.user._id
            }
        )

        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
        }catch(e){
            res.json({body:req.body, res:{e, 
                order: { 
                    orderItems: orderItems?true:false, 
                    shippingAddress: shippingAddress?true:false, 
                    paymentMethod: paymentMethod?true:false, 
                    itemsPrice: itemsPrice?true:false, 
                    taxPrice: taxPrice?true:false, 
                    shippingPrice: shippingPrice?true:false, 
                    totalPrice: totalPrice?true:false,  
                }
            }})
        }
    }
})

//restituisce tutti gli odini appartenenti ad un utente, nello specifico solo lutente a cui corrisponde il token della sessione del client
//accesso privato (security middleware)

export const getAllOrders = asyncHandler(async(req, res) => {

    const token = req.headers.authorization.replace('Bearer ', '')

    const decoded = jwt.decode(token, process.env.JWT_SECRET)

    const userId = decoded.id

    try{
        const orderList = await Order.find({user: userId})
        res.json((orderList))
    }catch(errorDetail){res.json({error: 'this user have no orders', errorDetail})}
    
})

//restituisce tutti gli odini appartenenti a tutti gli utenti, bisogna essere amministratore
//accesso privato (security middleware)

export const getAllUserOrders = asyncHandler(async(req, res) => {

    const token = req.headers.authorization.replace('Bearer ', '')

    const decoded = jwt.decode(token, process.env.JWT_SECRET)

    const userId = decoded.id

    const user = await User.findById(userId)

    if(user){
        if(user.isAdmin){
        try{
            let orderList = await Order.find({})
            orderList = await Promise.all(orderList.map(async o => {
                o.user = await User.findById(o.user)
                o.user = {
                    name: o.user.name,
                    email: o.user.email
                }
                return o
            }))
            res.json((orderList))
        }catch(errorDetail){
            res.json({error: 'this user have no orders', errorDetail})
        }
    }
}else{
        res.status(404).send('user not found')
    }
})


//restituisce un ordine in base al suo id
// get priivato

export const getOrderById = asyncHandler(async(req, res) => {
        const orderId = req.params.id+''
        const order = await Order.findById(orderId).populate('User', 'name email')
        
        if(order){
            res.json(order)
        }else{
            res.status(404)
            throw new Error('AAAGGGHHGH, Order not FOUUUUUUND!')
        }
})

//aggiorna l'ordina a pagato
// get privato

export const updateOrderById = asyncHandler(async(req, res) => {
    const orderId = req.params.id+''
    const order = await Order.findById(orderId);
    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.payment = {
            id: req.body.id,
            status: req.body,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    }else{
        res.status(404)
        throw new Error('AAAGGGHHGH, Order not FOUUUUUUND!')
    }
})

//aggiorna gli ordini di un utente
// get privato

export const getUserOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({user: req.user._id});
    
        res.json(orders)
})

//aggiorna l'ordina a spedito con la data
// get privato

export const setShippingDate = asyncHandler(async(req, res) => {
    const {orderId, date} = req.body
    const order = await Order.findById(orderId);
    if(order){
        order.isDelivered = true
        order.deliveredAt = date

        await order.save()
        res.json({message: 'success'})
    }else{
        res.status(404)
        throw new Error('AAAGGGHHGH, Order not FOUUUUUUND!')
    }
})