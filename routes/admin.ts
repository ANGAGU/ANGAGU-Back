import express from 'express';
import * as controller from '../controller/admin.controller';
import * as auth from '../controller/auth';

const router = express.Router();

router.get('/approve', controller.approveList);
router.put('/approve/:productId', controller.approveProduct);

export default router;
