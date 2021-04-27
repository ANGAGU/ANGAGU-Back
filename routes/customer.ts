import express from 'express';
import * as controller from '../controller/customer.controller';
import * as auth from '../controller/auth';

const router = express.Router();

router.post('/login', controller.login);
router.get('/products', controller.products);
router.get('/products/:productId', controller.productDetail);
router.get('/order', auth.authorization, controller.orderList);
router.get('/order/:orderId', auth.authorization, controller.orderDetail);
router.post('/signup', controller.signup);

export default router;
