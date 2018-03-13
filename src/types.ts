import { Handler, Request, Router } from 'express'

/**
 * Supported HTTP verb.
 */
export type Verb = 'post' | 'get' | 'put' | 'delete' | 'patch'

/**
 * Route definition for a public route.
 */
export type PublicEndpoint = {
  method: Handler
  public: true
}

/**
 * Route definition with restricted roles.
 */
export type RoleEndpoint<T> = {
  method: Handler
  public?: never
  roles?: T | T[]
}

/**
 * HTTP verb to endpoint mapping.
 */
export type RouteDefinition<T> = { [index in Verb]?: PublicEndpoint | RoleEndpoint<T> }

/**
 * URL to route config mapping.
 */
export type RouteConfig<T> = {
  [index: string]: RouteDefinition<T>
}

/**
 * Configuration options.
 */
export interface RouteOptions<T> {
  /**
   * Middleware for authentication. Usually, it should be a passport library.
   */
  authMiddleware: Handler
  /**
   * The express router where all endpoints will be attached.
   */
  router: Router
  /**
   * Configuration for all routes.
   */
  routes: RouteConfig<T>
  /**
   * A function to check whether a user has a given role.
   */
  hasRole: (req: Request, role: string) => boolean
  /**
   * A function to check whether a user is authentication.
   * For example, it can return `req.user != null`.
   */
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
