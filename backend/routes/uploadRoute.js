// import express from 'express'
// import multer from 'multer'
// import path from 'path'
// import imageToBase64 from './../utils/imageToBase64.js'
// import fs from 'fs'
// import {promisify} from 'util'
// import expressAsyncHandler from 'express-async-handler'

// const readFileAsync = promisify(fs.readFile)
// const deleteFileAsync = promisify(fs.unlink)

// const router = express.Router()

// // !! CONFIGURAZIONE MULTER 

// const storage = multer.diskStorage({
//     destination(req, file,callback){
//         console.log('hey');
//         callback(null,'uploads/')
//     },
//     //extname sta per EXTENSION NAME
//     filename(req, file, callback){
//         callback(null, `${file.fieldname}${Date.now()}${path.extname(file.originalname)}`)
//     }
// })
// // FUNZIONE CHE VIENE CHIAMATA AD OGNI UPLOAD PER CONTROLLARE IL TIPO DI FILE IN ARRIVO
// function checkFileType(file, callback) {
//     const acceptableFileTypes = /jpg|jpeg|png/
//     const isExtensionNameCorrect = acceptableFileTypes.test(path.extname((file.originalname).toLowerCase()))
//     const isMimeTypeCorrect = acceptableFileTypes.test(file.mimetype)
    
//     if(isExtensionNameCorrect && isMimeTypeCorrect){
//         return callback(null, true)
//     }else{
//         return callback('YOU FUCKING ASSHOLE WHAT ARE YA DOIN? THIS IS NOT AN IMAGE AND YA KNOW DAT!')
//     }
// }

// const upload = multer({
//     storage, 
//     // fileFilter: (req, file, callback) => checkFileType(file, callback)
// })

// // !! CONFIGURAZIONE MULTER

// router.post('/', upload.single('image'), expressAsyncHandler(async (req, res) => {
//     console.log(req.file)
//     // console.log(fs.readFileSync(req.file, {encoding: 'base64'}));
//     let data = await readFileAsync(req.file.path,'base64');
//     await deleteFileAsync(req.file.path)
//     console.log(data);
//     res.send(req.file.path+'')
// }
// )
// )

// export default router