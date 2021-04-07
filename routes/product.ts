import express from 'express';
import * as controller from '../controller/product.controller';

const router = express.Router();

router.get('/:id', controller.productDetail);

export default router;