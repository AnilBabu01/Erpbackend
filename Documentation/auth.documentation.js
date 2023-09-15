/**
 * @api {post} /api/register register user
 * @apiName register new user
 * @apiGroup Auth
 *
 * @apiBody {String} name user's name
 * @apiBody {String} email user's email
 * @apiBody {String} password user's password
 *
 * @apiSuccess {Boolean} status status of api response
 * @apiSuccess {String} msg  respective message for users.
 * @apiSuccess {Array} data  details of respective api
 *
 * @apiError {Boolean} status status of api response
 * @apiError {String} msg  respective message for users.
 * @apiError {Array} error  details of respective api
 */

/**
 * @api {post} /api/login resend OTP
 * @apiName login
 * @apiGroup Auth
 *
 * @apiBody {String} name user's name
 * @apiBody {String} email user's email
 * @apiBody {String} password user's password
 *
 * @apiSuccess {Boolean} status status of api response
 * @apiSuccess {String} msg  respective message for users.
 * @apiSuccess {Array} data  details of respective api
 *
 * @apiError {Boolean} status status of api response
 * @apiError {String} msg  respective message for users.
 * @apiError {Array} error  details of respective api
 */
