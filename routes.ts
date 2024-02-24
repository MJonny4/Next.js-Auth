/**
 * An array of routes that are accessible to the public
 * Do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ['/']

/**
 * An array of routes that are used for authenticated users
 * Will redirect to settings page if user is authenticated
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/register', '/auth/error']

/**
 * The prefix for API authentication routes.
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * The default redirect path after a successful login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings'
