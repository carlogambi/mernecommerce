import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'

import connectDb from './config/db.js'
import ProductRoute from './routes/productRoute.js'
import userRoute from './routes/userRoute.js'
import orderRoute from './routes/orderRoutes.js'
import errorMiddleware from './middleware/errorMiddleware.js'
// import uploadRoute from './routes/uploadRoute.js'

import path from 'path'
import clearUploadsFolder from './utils/clearUploadsFolder.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

clearUploadsFolder();

const PORT = process.env.PORT || 5000;

dotenv.config()

connectDb()

const app = express()

app.use(express.json({limit:'20mb'}))


app.use('/api/products', ProductRoute)
app.use('/api/users', userRoute)
app.use('/api/orders', orderRoute)
// app.use('/api/upload', uploadRoute)

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

app.use('/uploads', express.static(path.join(path.resolve(),'/uploads')))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(path.resolve(), '/frontend/build')))

    app.get('*', (req, res) => res.sendFile(path.resolve(path.resolve(), 'frontend', 'build', 'index.html')))
}else{
    
app.get('/', (req, res) => {
    res.send('api is running')
});
}

app.use(errorMiddleware.notFound)
app.use(errorMiddleware.errorHandler)

app.listen(PORT, console.log(`server running mode: ${process.env.NODE_ENV}, port: ${PORT}`.yellow.bold))