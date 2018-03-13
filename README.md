# Express route config
A simple route configuration for Express apps powered by Typescript typing.

[![Greenkeeper badge](https://badges.greenkeeper.io/effectivex/express-route-config.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/effectivex/express-route-config.svg)](https://travis-ci.org/effectivex/express-route-config)
[![Coveralls](https://img.shields.io/coveralls/effectivex/express-route-config.svg)](https://coveralls.io/github/effectivex/express-route-config)
[![Dev Dependencies](https://david-dm.org/effectivex/express-route-config/dev-status.svg)](https://david-dm.org/effectivex/express-route-config?type=dev)


### About
The motivation is to provide a simple util for role based authentication. It's a common scenario in web apps that some routes are public, allowed only for authentication users or only for admins.


### Getting Started

```bash
npm install express-route-config
```
```bash
yarn add express-route-config
```

### Example

```ts
import passport from 'passport';
import { loadRoutes } from 'express-route-config';

const app = express();
const router = Router();

type UserRole = 'user' | 'admin' | 'reporter';

loadRoutes<UserRole>({
  // use any ExpressJS middleware for authentication
  // The middleware should set `req.user` if authentication was successful.
  authMiddleware: passport.authenticate('bearer', { session: false }),
  router,
  hasRole: (req, role) => req.user.role === role,
  isLoggedIn: req => req.user != null,
  routes: {
    '/public': {
      get: {
        method: handler,
        public: true,
      },
    },
    '/public2': {
      get: {
        // method can be any valid handler/middleware used in Express
        method: [handler, handler2, handler3],
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
});

app.use('/', router);

// in types/index.ts
// extend the Request object to include a `user` property.
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: UserRole
      };
    }
  }
}

```

### Docs
[API Reference](https://effectivex.github.io/express-route-config/)

### License
MIT