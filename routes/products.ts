import express from 'express';
import * as controller from '../controller/products.controller';

const router = express.Router();

router.get('/:productId', controller.productDetail);

export default router;