/**
 * ForumComments.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        comment: {
            type: 'string',
            required: true
        },
        owner: {
            model: 'user',
            required: true
        },
        post: {
            model: 'forumPosts',
            required: true
        }
    }
};