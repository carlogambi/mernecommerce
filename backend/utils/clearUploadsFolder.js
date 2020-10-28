import fs from 'fs'
import { promisify} from 'util'
import path from 'path'
import colors from 'colors'

const readdirAsync = promisify(fs.readdir)
const deleteFileAsync = promisify(fs.unlink)

export default async() => {
    try{
    const uploadsFolder = await readdirAsync('uploads/');
    for(const file of uploadsFolder){
        await deleteFileAsync(path.join('uploads', file))
        console.log('uploads folder empty'.cyan);
    }
    }catch(error){
        console.log(error);
    }
}