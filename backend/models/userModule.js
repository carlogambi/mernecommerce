import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const reviewsSchema = mongoose.Schema({
    userName: { type: String, required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, 
    title: { type: String,  },
    rating: { type: String, required: true },
    comment: { type: String,  },
}, {
    timestamps:true
})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    favorites: [{
        name: {type: String},
        list: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }]
    }]
}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function(enteredPssw) {
    return await bcrypt.compare(enteredPssw, this.password)
}

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    //salt????
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


const User = mongoose.model('User', userSchema)

export default User