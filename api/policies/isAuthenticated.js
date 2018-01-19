/**
 * isAuthenticated
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function(req, res, next) {
    var token;

    if (req.headers && req.headers.authorization) {
        token = req.headers.authorization.replace(/^Bearer\s/, '');
    } else if (req.param('token')) {
        token = req.param('token').replace(/^Bearer\s/, '');
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
    } else {
        return res.json(401, { status: 'error', err: 'No Authorization header was found' });
    }

    jwToken.verify(token, function(err, token) {
        if (err) {
            sails.log.error(err);
            return res.json(401, { status: 'error', err: 'Invalid Token!' });
        }

        req.token = token; // This is the decrypted token or the payload you provided
        next();
    });
};
