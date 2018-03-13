import * as HTTPError from 'http-errors'
import { RouteOptions, Verb } from './types'
import { RequestHandler, Handler } from 'express'
import { wrapAsync } from './wrapAsync'

const entries = <T>(o: T) => {
  return Object.entries(o) as Array<[keyof T, T[keyof T]]>
}

/**
 * Load route configuration into the express router.
 * @param options
 */
export function loadRoutes<T>(options: RouteOptions<T>) {
  const { authMiddleware, router, routes, hasRole, isLoggedIn } = options
  entries(routes).forEach(([url, verbs]) => {
    entries(verbs).forEach(([verb, def]) => {
      if (def == null) {
        return
      }
      const actions: Handler[] = [
        (req, res, next) => {
          if (!req.headers.authorization) {
            return next()
          }
          return authMiddleware(req, res, next)
        },
        (req, res, next) => {
          if (def.public) {
            next()
            return
          }
          if (!isLoggedIn(req)) {
            next(new HTTPError.Unauthorized())
            return
          }
          next()
        }
      ]
      const method = def.method
      if (!method) {
        throw new Error(`method is undefined in ${verb.toUpperCase()} ${url}`)
      }
      actions.push(method)
      router[verb](url, wrapAsync(actions))
    })
  })
}
