/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

    /***************************************************************************
     *                                                                          *
     * Default policy for all controllers and actions (`true` allows public     *
     * access)                                                                  *
     *                                                                          *
     ***************************************************************************/
    '*': ['isAuthenticated'], // Everything resctricted here
    '*': ['isAdmin'], // Everything resctricted here


    /***************************************************************************
     *                                                                          *
     * policy for excluding auth controller and actions from authentication check
     *                                                                          *
     *                                                                          *
     ***************************************************************************/

    'UserController': { // We dont need authorization here, allowing public access
        'create': true,
        'delete': ['isHigh', 'isAdmin'],
        'update': ['isAuthenticated']

    },

    'AdminController': {
        '*': ['isAdmin', 'isAuthenticated'],
        'forgotPassword': true,
        'create': ['isAdmin', 'isHigh', 'isAuthenticated'],
        'delete': ['isAdmin', 'isSuper', 'isAuthenticated'],
        'get': ['isAdmin', 'isSuper', 'isAuthenticated'],
        'getCount': ['isAdmin', 'isLow', 'isAuthenticated']
    },

    'AuthController': {
        '*': true // We dont need authorization here, allowing public access
    },

    'PaystackController': {
        'verify': true
    },

    'PaymentsController': {
        'get': ['isAdmin', 'isHigh', 'isAuthenticated'],
    },

    'AuditController': {
        '*': ['isAdmin', 'isSuper', 'isAuthenticated']
    },

    'ProjectController': {
        '*': ['isAdmin', 'isLow', 'isAuthenticated'],
        'get': ['isUser', 'isAuthenticated']
    },

    'TrainingController': {
        '*': ['isAdmin', 'isLow', 'isAuthenticated'],
        'get': ['isUser', 'isAuthenticated']
    },

    'EventsController': {
        '*': ['isAdmin', 'isLow', 'isAuthenticated'],
        'get': ['isUser', 'isAuthenticated']
    },

    'DonationController': {
        '*': ['isAdmin', 'isHigh', 'isAuthenticated'],
        'get': ['isUser', 'isAuthenticated']
    },

    'LevelsController': {
        '*': ['isAdmin', 'isHigh', 'isAuthenticated'],
        'get': ['isUser', 'isAuthenticated'],
    },

    'KnowledgeBaseController': {
        '*': ['isAdmin', 'isAuthenticated'],
        'get': ['isUser', 'isAuthenticated'],

        'create': ['isUser', 'isAuthenticated'],
        'uploadDocument': ['isUser', 'isAuthenticated'],
        'update': ['isUser', 'isAuthenticated'],
        'delete': ['isAdmin', 'isHigh', 'isAuthenticated'],
        'getDoc': ['isUser', 'isAuthenticated'],
    },

    'ApproverController': {
        '*': ['isAdmin', 'isLow', 'isAuthenticated'],
    },

    'VerifierController': {
        '*': ['isAdmin', 'isLow', 'isAuthenticated'],
    },

    'PaymentsController': {
        '*': ['isAdmin', 'isHigh', 'isAuthenticated'],
        //'*': true,
    },

    /***************************************************************************
     *                                                                          *
     * Here's an example of mapping some policies to run before a controller    *
     * and its actions                                                          *
     *                                                                          *
     ***************************************************************************/
    // RabbitController: {

    // Apply the `false` policy as the default for all of RabbitController's actions
    // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
    // '*': false,

    // For the action `nurture`, apply the 'isRabbitMother' policy
    // (this overrides `false` above)
    // nurture  : 'isRabbitMother',

    // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
    // before letting any users feed our rabbits
    // feed : ['isNiceToAnimals', 'hasRabbitFood']
    // }
};
