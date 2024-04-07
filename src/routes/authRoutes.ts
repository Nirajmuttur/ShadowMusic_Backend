import express from 'express';
import {authenticate,redirect} from '../controller/authController.ts'
const router = express.Router();

router.route('/login').get(authenticate)
router.route('/redirect').get(redirect)

export default router