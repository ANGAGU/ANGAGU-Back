import express from 'express';
import * as controller from '../controller/admin.controller';
import * as auth from '../controller/auth';

const router = express.Router();

router.post('/login', controller.login);
router.get('/products', auth.authorization, controller.approveProductList);
router.put('/products/:productId', auth.authorization, controller.approveProduct);
router.get('/sale/company/:companyId', auth.authorization, controller.companySale);

router.get('/sale', auth.authorization, controller.sale);
router.get('/sale/company', auth.authorization, controller.saleCompany);

router.get('/company/approve', auth.authorization, controller.getApprove);
router.post('/company/approve/:companyId', auth.authorization, controller.postApprove);

router.get('/companies', auth.authorization, controller.companies);

export default router;
