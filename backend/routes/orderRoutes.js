import express from 'express'
import { 
    addOrderItems,
    getAllOrders,
    getOrderById,
    getUserOrders,
    updateOrderById,
    getAllUserOrders,
    setShippingDate
} from './../controllers/orderController.js'
import { protect, isAdmin } from './../middleware/authorizationMiddleWare.js'
//ROUTE DEL FILE -> api/orders

const router = express.Router();

router.route('/').post(protect, addOrderItems)
router.route('/allOrders').get(protect, getAllOrders)
router.route('/getOrder/:id').get(protect, getOrderById)
router.route('/getOrder/:id/pay').put(protect, updateOrderById)
router.route('/userOrders').get(protect, getUserOrders)
router.route('/allUsersOrders').get(protect, isAdmin, getAllUserOrders)
router.route('/setShippingDate').put(protect, isAdmin, setShippingDate)

    
 
export default router