import asyncHandler from 'express-async-handler'
import Product from './../models/productModel.js'
import fs from 'fs'
import {promisify} from 'util'
import imgToB64 from 'image-to-base64'

const deleteFileAsync = promisify(fs.unlink)

//ROUTE DEL FILE -> api/products


// restituisce tutti i prodotti
// accesso public

export const getProducts = asyncHandler(async (req,res) =>{
    const products = await Product.find({})
    res.json(products)
})

// restituisce un prodotto attraverso id
// accesso public 
export const getProductById = asyncHandler(
    async (req,res) => {
        const product = await Product.findById(req.params.id)
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message: 'ohay, product not fouund'})
        }
    }
) 

// crea un nuovo prodotto
// accesso privato admin 
export const createNewProduct = asyncHandler(
    async (req,res) => {
        const {
            name,
            description,
            countInStock,
            price,
            brand,
            category,
            user
        } = req.body

        try {
        
            const image = req.files['image'][0]

            if(image){

                let b64Image = await imgToB64(image.path)

                b64Image = `data:${image.mimetype};base64,${b64Image}`

                await deleteFileAsync(image.path)

                const newProduct = new Product({
                    name,
                    description,
                    countInStock,
                    price,
                    image: b64Image,
                    brand,
                    category,
                    user
                })

                newProduct.save(
                    err => 
                        err
                        ?
                            res.json({success: false, message: 'product not created, call master organism to fix the problem'})
                        :
                            res.json({success: true, message: 'data saved'})
                )  
            }
        }catch (error) {
            // res.json({message: 'sever malfunction, data not saved', data: error})
            // throw new Error(error)
        }

    }
)

// DISTRUGGE un prodotto attraverso id
// accesso privato admin 
export const deleteProduct = asyncHandler(
    async (req,res) => {
        Product.deleteOne({_id: req.params.id},(err) => {
            if(err){
                res.status(404).json({message: 'ohay, product not deleted'})
            }else{
                res.send(`${req.params.id} deleted!`)
            }

        })
            
        
    }
) 


// modifica un nuovo prodotto
// accesso privato admin 
export const editProduct = asyncHandler(
    async (req,res) => {
        const {
            name,
            description,
            countInStock,
            price,
            brand,
            category,
            user
        } = req.body

        const product = await Product.findById(req.body.productId)
        
        if(product){
            product.name = name
            product.description = description
            product.countInStock = countInStock
            product.price = price
            product.brand = brand
            product.category = category
            product.user = user
            
            if(!(req.body.image === 'not changed')){
                const image = req.files['image'][0]
                if(image){
                    
                    let b64Image = await imgToB64(image.path)
                    
                    b64Image = `data:${image.mimetype};base64,${b64Image}`
                    
                    await deleteFileAsync(image.path)

                    product.image = b64Image
                }
            }
            product.save(err =>{
                if(err)res.json({message:'product NOT saved', success: false, error: err})
                res.send({message:'product saved', success: true})
            })
        }
        
        
        
    }
    )
    
    
    // aggiunge una recensione a n prodotto
    // accesso privato  
    export const addNewReview = asyncHandler(
        async (req,res) => {

            const productId = req.params.id
            const review = req.body

            if(productId && review){
                try{
                    
                    const product = await Product.findById(productId)
                    

                    product.reviews.push(review)

                    await product.save()

                }catch(e){
                    res.status(500)
                    throw new Error(e)
                }
            }else{
                res.status(401)
                throw new Error(`missing product id or review ${JSON.stringify({productId, review})}`)
            }

                
            
        }
    ) 


