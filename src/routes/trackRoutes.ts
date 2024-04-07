import express from 'express';
import { getIdByName } from '../controller/trackController.ts';

const router = express.Router();

router.route('/getSong/:id').get(getIdByName)

export default router