import request from 'supertest';
import { app } from './wrap-async-app';
import { wrapAsync } from '../src/wrapAsync';
import { loadRoutes } from '../src/loadRoutes';
import { Router, Handler, Request, default as express } from 'express';

const falseFn = () => false;
const trueFn = () => true;

const getApp = (
  hasRole: (req: Request, role: string) => boolean,
  isLoggedIn: (req: Request) => boolean,
  authMiddleware: Handler = (req, res, next) => next(),
) => {
  const router = Router();
  const handler: Handler = (req, res) => {
    res.json({ ok: true });
  };
  loadRoutes<'user' | 'admin' | 'reporter'>({
    authMiddleware,
    router,
    routes: {
      '/public': {
        get: {
          method: handler,
          public: true,
        },
      },
      '/auth': {
        get: {
          method: handler,
        },
      },
      '/admin-only': {
        get: {
          method: handler,
          roles: 'admin',
        },
      },
      '/any-roles': {
        get: {
          method: handler,
          roles: ['user', 'admin'],
        },
      },
    },
    hasRole,
    isLoggedIn,
  });
  const app = express();
  app.use('/', router);
  return app;
};

describe('/public', () => {
  it('authMiddleware should return error if authorization is defined', async () => {
    const app = getApp(falseFn, falseFn, (req, res) => {
      res.status(400);
      res.json({ error: 123 });
    });
    await request(app)
      .get('/public')
      .set('authorization', 'foo')
      .expect(400, { error: 123 });
  });
  it('authMiddleware should not return error if authorization is not defined', async () => {
    const app = getApp(falseFn, falseFn, (req, res) => {
      res.status(400);
      res.json({ error: 123 });
    });
    await request(app)
      .get('/public')
      .expect(200, { ok: true });
  });

  it('should return 200', async () => {
    const app = getApp(falseFn, falseFn);
    await request(app)
      .get('/public')
      .expect(200, { ok: true });
  });
});

describe('/auth', () => {
  it('should return 401 if not logged in', async () => {
    const app = getApp(falseFn, falseFn);
    await request(app)
      .get('/auth')
      .expect(401);
  });

  it('should return 200 if logged in', async () => {
    const app = getApp(falseFn, trueFn);
    await request(app)
      .get('/auth')
      .expect(200, { ok: true });
  });
});

describe('/admin-only', () => {
  it('should return 403 if not admin', async () => {
    const app = getApp((req, role) => role === 'user', trueFn);
    await request(app)
      .get('/admin-only')
      .expect(403);
  });

  it('should return 200 if admin', async () => {
    const app = getApp((req, role) => role === 'admin', trueFn);
    await request(app)
      .get('/admin-only')
      .expect(200, { ok: true });
  });
});

describe('/any-roles', () => {
  it('should return 200 if admin', async () => {
    const app = getApp((req, role) => role === 'admin', trueFn);
    await request(app)
      .get('/any-roles')
      .expect(200, { ok: true });
  });
  it('should return 200 if user', async () => {
    const app = getApp((req, role) => role === 'user', trueFn);
    await request(app)
      .get('/any-roles')
      .expect(200, { ok: true });
  });
  it('should return 403 if reporter', async () => {
    const app = getApp((req, role) => role === 'reporter', trueFn);
    await request(app)
      .get('/any-roles')
      .expect(403);
  });
});
