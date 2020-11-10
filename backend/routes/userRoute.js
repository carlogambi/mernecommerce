import express from 'express'
import { 
    authorizeUser, 
    deleteUser, 
    getAdminUsers, 
    getUserById, 
    getUserProfile,
    registerUser,
    updateUserProfile,
    getUserReviews,
    deleteUserReviews
} from './../controllers/userController.js'
import { protect, isAdmin } from './../middleware/authorizationMiddleWare.js'
//ROUTE DEL FILE -> api/users

const router = express.Router();
// api/users/getById/:id

 
router.route('/').get(protect, isAdmin, getAdminUsers) 
router.route('/getById/:id').get(protect, isAdmin, getUserById) 
router.route('/delete/:id').delete(protect, isAdmin, deleteUser) 
router.route('/register').post(registerUser)
router.post('/login', authorizeUser)
router.route('/profile/').get(protect, getUserProfile)
router.route('/getReviews/').get(protect, getUserReviews)
router.route('/deleteReview/:productId/:reviewId').delete(protect, deleteUserReviews)
router.route('/update').get(protect, updateUserProfile).put(protect, updateUserProfile)
    
 
export default router