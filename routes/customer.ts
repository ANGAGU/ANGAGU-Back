import express from 'express';
import * as controller from '../controller/customer.controller';

const router = express.Router();

router.post('/login', controller.login);
router.get('/products', controller.products);
router.get('/products/:productId', controller.productDetail);

export default router;
