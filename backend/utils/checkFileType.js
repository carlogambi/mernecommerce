 // FUNZIONE CHE VIENE CHIAMATA AD OGNI UPLOAD PER CONTROLLARE IL TIPO DI FILE IN ARRIVO
 import path from 'path'

 const checkFileType = (file, callback) => {
    const acceptableFileTypes = /jpg|jpeg|png/
    const isExtensionNameCorrect = acceptableFileTypes.test(path.extname((file.originalname).toLowerCase()))
    const isMimeTypeCorrect = acceptableFileTypes.test(file.mimetype)
    
    if(isExtensionNameCorrect && isMimeTypeCorrect){
        return callback(null, true)
    }else{
        return callback('YOU FUCKING ASSHOLE WHAT ARE YA DOIN? THIS IS NOT AN IMAGE AND YA KNOW DAT!')
    }
}

export default checkFileType