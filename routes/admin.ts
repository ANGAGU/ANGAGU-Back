import express from 'express';
import * as controller from '../controller/admin.controller';
import * as auth from '../controller/auth';

const router = express.Router();

router.get('/approve', controller.approveList);

export default router;
