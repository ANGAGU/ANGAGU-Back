import express from 'express';
import * as controller from '../controller/company.controller';
import * as auth from '../controller/auth';

const router = express.Router();

router.post('/login', controller.login);
router.get('/products', auth.authorization, controller.products);

export default router;
