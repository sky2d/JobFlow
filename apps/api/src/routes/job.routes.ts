import { Router } from 'express';
import { createJob, getJob } from '../controllers/job.controller';

const router = Router();

router.post('/', createJob);
router.get('/:id', getJob);

export const jobRoutes = router;
