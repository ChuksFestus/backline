/**
 * User.js
 *
 * @description :: Model to manage the user data.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// We don't want to store password with out encryption
var bcrypt = require('bcrypt');

module.exports = {

    attributes: {

        membershipId: {
            type: 'string',
            //required: true
        },
        email: {
            type: 'email',
            //required: true,
            unique: true
        },
        password: {
            type: 'string',
            //required: true
        },
        bizNature: {
            type: 'string',
            //required: true
        },
        company: {
            type: 'string',
            //required: true
        },
        companyCOIUrl: {
            type: 'string',
            //required: true
        },
        phone: {
            type: 'string',
            //required: true
        },
        companyRepName1: {
            type: 'string',
            //required: true
        },
        companyRepPhone1: {
            type: 'string',
            //required: true
        },
        companyRepEmail1: {
            type: 'string',
            //required: true
        },
        companyRepPassportUrl1: {
            type: 'string',
            //required: true
        },
        companyRepCVUrl1: {
            type: 'string',
            //required: true
        },
        companyRepName2: {
            type: 'string',
            //required: true
        },
        companyRepPhone2: {
            type: 'string',
            //required: true
        },
        companyRepEmail2: {
            type: 'string',
            //required: true
        },
        companyRepPassportUrl2: {
            type: 'string',
            //required: true
        },
        companyRepCVUrl2: {
            type: 'string',
            //required: true
        },
        address: {
            type: 'text',
            //required: true
        },
        tradeGroup: {
            type: 'string',
            //required: true
        },
        annualReturn: {
            type: 'string',
            //required: true
        },
        annualProfit: {
            type: 'string',
            //required: true
        },
        employees: {
            type: 'string',
            //required: true
        },
        profileImage: {
            //type: 'string',
        },
        role: {
            type: 'string',
            defaultsTo: 'User'
        },
        membershipStatus: {
            type: 'string',
            defaultsTo: 'inactive'
        },
        membershipFee: {
            type: 'string',
            defaultsTo: 'unpaid'
        },
        membershipPlan: {
            type: 'string',
            defaultsTo: null
        },
        friends: {
            collection: 'user',
            via: 'id'
        },
        friendRequests: {
            collection: 'socialConnections',
            via: 'requestee'
        },
        posts: {
            collection: 'socialPosts',
            via: 'owner'
        },
        forumTopics: {
            collection: 'forumTopics',
            via: 'creator'
        },
        forumPosts: {
            collection: 'forumPosts',
            via: 'creator'
        },
        verified: {
            type: 'boolean',
            defaultsTo: false
        },
        verifiedRejectionReason: {
            type: 'text',
        },
        approved: {
            type: 'boolean',
            defaultsTo: false
        },
        approvedRejectionReason: {
            type: 'text',
        },
        rejected: {
            type: 'boolean',
            defaultsTo: false
        },
        referred1: {
            type: 'boolean',
            defaultsTo: false
        },
        referred2: {
            type: 'boolean',
            defaultsTo: false
        },
        referrer1: {
            type: 'string',
            //required: 'true'
        },
        referrer2: {
            type: 'string',
            //required: 'true'
        },
        referrerMemberId1: {
            type: 'string',
            //required: 'true'
        },
        referrerMemberId2: {
            type: 'string',
            //required: 'true'
        },

        // Add a reference to KnowledgeBase
        documents: {
            collection: 'knowledgebaseDocuments',
            via: 'uploader'
        },
        trainingPayments: {
            collection: 'trainingPayments',
            via: 'payer'
        },
        donationPayments: {
            collection: 'donationPayments',
            via: 'donator'
        }
    },

    // Here we encrypt password before creating a User
    beforeCreate: function(values, next) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(values.password, salt, function(err, hash) {
                if (err) return next(err);
                values.password = hash;
                next();
            })
        })
    },

    // // Here we encrypt password before creating an Admin
    // beforeCreate: function(values, next) {
    //     bcrypt.genSalt(10, function(err, salt) {
    //         if (err) return next(err);
    //         bcrypt.hash(values.password, salt, function(err, hash) {
    //             if (err) return next(err);
    //             values.password = hash;
    //             next();
    //         })
    //     })
    // },

    // Here we compare password with available hash
    comparePassword: function(password, user, cb) {
        bcrypt.compare(password, user.password, function(err, match) {
            if (err) cb(err);
            if (match) {
                cb(null, true);
            } else {
                cb(err);
            }
        })
    }
};