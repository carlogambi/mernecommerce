import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

import connectDb from './config/db.js'

import users from './data/users.js'
import products from './data/products.js'

import User from './models/userModule.js'
import Product from './models/productModel.js'
import Order from './models/orderModule.js'

dotenv.config()
connectDb()

const insertDataInDatabase = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdsers = await User.insertMany(users)

        const adminUser = createdsers[0]._id

        const sampleProducts = products.map(p => {
            return {
                ...p, 
                user: adminUser
            }
        })

        await Product.insertMany(sampleProducts)
        console.log('data imported'.green.inverse);
    } catch (error) {
        console.log(`error: ${error.message}`.red.inverse);
        process.exit(1)
    }
}

const destroyAllDatainDatabase = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('data destroyed!!!'.red.inverse);
        process.exit()
    } catch (error) {
        console.log(`error: ${error.message}`.red.inverse);
        process.exit(1)
    }
}

if(process.argv[2] === '-d'){
    destroyAllDatainDatabase()
}else{
    insertDataInDatabase()
}