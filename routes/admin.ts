import express from 'express';
import * as controller from '../controller/admin.controller';
import * as auth from '../controller/auth';

const router = express.Router();

router.post('/login', controller.login);
router.get('/products', auth.authorization, controller.approveProductList);
router.put('/products/:productId', auth.authorization, controller.approveProduct);
router.get('/sale/:companyId', auth.authorization, controller.companySale);
router.get('/sale', auth.authorization, controller.totalFee);
router.get('/companies', auth.authorization, controller.companies);

export default router;
