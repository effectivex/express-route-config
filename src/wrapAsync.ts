import { Handler, Request, Router } from 'express'

/**
 * Wrap async function to standard express function
 * @param  fn the async function
 * @returns the wrapped function
 */
function wrapRoute(fn: Handler): Handler {
  if (typeof fn !== 'function') {
    throw new Error('fn should be a function')
  }
  return (req, res, next) => {
    try {
      const result = fn(req, res, next)
      if (result && result.catch) {
        result.catch(next)
      }
    } catch (e) {
      next(e)
    }
  }
}

/**
 * Wrap all middlewares from array
 * @param obj the object (controller exports)
 * @returns the wrapped object
 */
export function wrapAsync(obj: Handler): Handler
export function wrapAsync(obj: Handler[]): Handler[]
export function wrapAsync(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(wrapAsync)
  }
  return wrapRoute(obj)
}
