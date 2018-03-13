import { Handler, Request, Router } from 'express'

export type Verb = 'post' | 'get' | 'put' | 'delete' | 'patch'

export type PublicDefinition = {
  method: Handler
  public: true
}

export type RoleDefinition<T> = {
  method: Handler
  public?: never
  roles?: T | T[]
}

export type RouteDefinition<T> = { [index in Verb]?: PublicDefinition | RoleDefinition<T> }

export type RouteConfig<T> = {
  [index: string]: RouteDefinition<T>
}

export interface RouteOptions<T> {
  authMiddleware: Handler
  router: Router
  routes: RouteConfig<T>
  // roles: T;
  hasRole: (req: Request, role: string) => boolean
  isLoggedIn: (req: Request) => boolean
}

// const dummyHandler = () => null;

// loadRoutes<'user' | 'admin'>({
//   authMiddleware: () => null,
//   router: Router(),
//   routes: {
//     '/login': {
//       post: {
//         method: dummyHandler,
//         public: true,
//       },
//       get: {
//         method: dummyHandler,
//         // public: false,
//         // public2: false,
//         roles: 'user',
//       },
//       put: {
//         method: dummyHandler,
//         // public: false,
//         // public2: false,
//         roles: ['user', 'admin'],
//       },
//     },
//   },
//   // roles: ['admin' 'user'],
//   hasRole: req => false,
//   isLoggedIn: req => false,
// });
