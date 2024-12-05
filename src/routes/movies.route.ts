import { Router, Request, Response } from 'express';
import movieController from '../controllers/movies.controller';

const router = Router();
router.get('/', async (req: Request, res: Response) => await movieController(req, res));

export default router;

