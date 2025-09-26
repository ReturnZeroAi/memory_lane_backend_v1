import { Router } from 'express';

const router = Router();

// TODO: add endpoints
router.get('/health', (_req, res) => res.json({ ok: true }));

export default router;
