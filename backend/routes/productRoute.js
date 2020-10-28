import express from 'express'
import multer from 'multer'
import path from 'path'
import imageToBase64 from './../utils/imageToBase64.js'
import fs from 'fs'
import {promisify} from 'util'
import expressAsyncHandler from 'express-async-handler'
import { isAdmin, protect } from '../middleware/authorizationMiddleWare.js';
import { addNewReview, createNewProduct, getProductById, getProducts, deleteProduct, editProduct } from './../controllers/productController.js'
import checkFileType from '../utils/checkFileType.js'


// !! CONFIGURAZIONE MULTER 

const storage = multer.diskStorage({
    destination(req, file,callback){
        callback(null,'uploads/')
    },
    //extname sta per EXTENSION NAME
    filename(req, file, callback){
        callback(null, `${file.fieldname}${Date.now()}${path.extname(file.originalname)}`)
    }
})


const upload = multer({
    storage, 
    fileFilter: (req, file, callback) => checkFileType(file, callback)
})

const newProductFields = upload.fields([
    { name: 'name' },
    { name: 'description' },
    { name: 'image' },
    { name: 'countInStock' },
    { name: 'price' },
])


//ROUTE DEL FILE -> api/products

const router = express.Router();


router.route('/').get(getProducts)
router.route('/:id').get(getProductById)
router.route('/newProduct').post(protect, isAdmin, newProductFields, createNewProduct)
router.route('/edit/:id').put(protect, isAdmin, newProductFields, editProduct)
router.route('/delete/:id').delete(protect, isAdmin, deleteProduct)
router.route('/newReview/:id').put(protect,  addNewReview)
    

export default router