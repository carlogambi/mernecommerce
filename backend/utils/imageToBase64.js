
export const bytesToSize = (bytes) => (bytes / (1024*1024)).toFixed(4)
 

 const imageToBase64 = file => new Promise((resolve, reject) => {
    if(!(file.type.split('/')[0] === 'image') || !file){
        console.log('unauhorized file type')
    }else{
        console.log(bytesToSize(file.size))
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => alert(error);
    }
});

export default imageToBase64