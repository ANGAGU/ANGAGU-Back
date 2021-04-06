import express from 'express';
import * as controller from '../controller/customer.controller';

const router = express.Router();

router.post('/login', controller.login);

export default router;
