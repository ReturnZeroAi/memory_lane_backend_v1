import request from 'supertest';
import app from '../../apps/api/src/app';

describe('smoke', () => {
  it('auth health', async () => {
    const res = await request(app).get('/api/auth/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});
