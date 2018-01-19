var nestedPop = require('nested-pop');

/**
 * SocialController
 *
 * @description :: Server-side logic for managing socials
 * @help
 */

/**
 * @apiDefine RequesterIdNotProvidedError
 *
 * @apiError RequesterIdNotProvided No Requester id provided.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *     {
 *       "status": "error",
 *       "err": "No Requester id provided!"
 *     }
 */

/**
 * @apiDefine RequesteeIdNotProvidedError
 *
 * @apiError RequesteeIdNotProvided No Requestee id provided.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *     {
 *       "status": "error",
 *       "err": "No Requestee id provided!"
 *     }
 */

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "error",
 *       "message": 'No User with such id existing'
 *     }
 */

/**
 * @apiDefine PostNotFoundError
 *
 * @apiError PostNotFound The id of the Post was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "error",
 *       "message": 'No Post with such id existing'
 *     }
 */

/**
 * @apiDefine PostIdNotProvidedError
 *
 * @apiError PostIdNotProvided No post id provided.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *     {
 *       "status": "error",
 *       "err": "No Post id provided!"
 *     }
 */

/**
 * @apiDefine CommentNotFoundError
 *
 * @apiError CommentNotFound The id of the Comment was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "error",
 *       "message": 'No Comment with such id existing'
 *     }
 */

/**
 * @apiDefine CommentIdNotProvidedError
 *
 * @apiError CommentIdNotProvided No comment id provided.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *     {
 *       "status": "error",
 *       "err": "No Comment id provided!"
 *     }
 */

/**
 * @apiDefine SearchTermNotProvidedError
 *
 * @apiError SearchTermNotProvided No search term provided.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *     {
 *       "status": "error",
 *       "err": "No search term provided!"
 *     }
 */


module.exports = {



    /**
     * `SocialController.request()`
     *
     * ----------------------------------------------------------------------------------
     * @api {post} /api/v1/social/request Send a friend request
     * @apiName Request
     * @apiDescription This is where the friend request is registered to the database
     * @apiGroup Social
     *
     * @apiParam {Number} requester ID of the requester.
     * @apiParam {Number} requestee ID of the requestee.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Friend request sent"
     *     }
     *
     * @apiUse RequesterIdNotProvidedError
     *
     * @apiUse RequesteeIdNotProvidedError
     *
     * @apiUse UserNotFoundError
     */
    request: function(req, res) {
        if (!req.param('requester')) {
            return res.json(401, { status: 'error', err: 'No Requester id provided!' });
        }

        if (!req.param('requestee')) {
            return res.json(401, { status: 'error', err: 'No Requestee id provided!' });
        }

        SocialConnections.create(req.body).exec(function(err, friendRequest) {
            if (err) {
                sails.log.error(err);
                return res.json(err.status, { err: err });
            }

            if (friendRequest) {
                res.json(200, { status: 'success', message: 'Friend request sent' });
            }
        });
    },

    /**
     * `SocialController.cancel()`
     *
     * ----------------------------------------------------------------------------------
     * @api {post} /api/v1/social/cancel Cancel a friend request
     * @apiName Cancel
     * @apiDescription This is where a friend request is canceled befor it is accepted by the requestee
     * @apiGroup Social
     *
     * @apiParam {Number} requester ID of the requester.
     * @apiParam {Number} requetee ID of the requestee.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "'Friend request canceled"
     *     }
     *
     * @apiUse RequesterIdNotProvidedError
     *
     * @apiUse RequesteeIdNotProvidedError
     *
     * @apiUse UserNotFoundError
     */
    cancel: function(req, res) {
        if (!req.param('requester')) {
            return res.json(401, { status: 'error', err: 'No User id provided!' });
        }

        if (!req.param('requestee')) {
            return res.json(401, { status: 'error', err: 'No Requestee id provided!' });
        }

        SocialConnections.findOne({ select: 'requester', where: { requester: req.param('requester'), requestee: req.param('requestee') } }).exec(function(err, requester) {
            if (err) {
                sails.log.error(err);
                return res.json(err.status, { err: err });
            }

            if (!requester) {
                return res.json(404, { status: 'error', err: 'No User with such requester id existing' })
            } else {
                SocialConnections.destroy({ requester: req.param('requester'), requestee: req.param('requestee') }).exec(function(err) {
                    if (err) {
                        sails.log.error(err);
                        return res.json(err.status, { err: err });
                    }

                    return res.json(200, { message: 'success', message: 'Friend request canceled' });
                });
            }
        });
    },


    /**
     * `SocialController.remove()`
     *
     * ----------------------------------------------------------------------------------
     * @api {post} /api/v1/social/remove Terminate a friendship
     * @apiName Remove
     * @apiDescription This is where a friendship is terminated or destroyed
     * @apiGroup Social
     *
     * @apiParam {Number} requester ID of the requester.
     * @apiParam {Number} requestee ID of the requestee.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Friendship terminated"
     *     }
     *
     * @apiUse RequesterIdNotProvidedError
     *
     * @apiUse RequesteeIdNotProvidedError
     *
     * @apiUse UserNotFoundError
     */
    remove: function(req, res) {
        if (!req.param('requester')) {
            return res.json(401, { status: 'error', err: 'No Requester id provided!' });
        }

        if (!req.param('requestee')) {
            return res.json(401, { status: 'error', err: 'No Requestee id provided!' });
        }

        User.findOne({ select: 'username', where: { id: req.param('requestee') } }).populate('friends').exec(function(err, user) {
            if (err) {
                sails.log.error(err);
                return res.json(err.status, { err: err });
            }

            if (!user) {
                return res.json(404, { status: 'error', err: 'No User with such requestee id existing' });
            } else {

                user.friends.remove(req.param('requester'));
                user.save(function(err) {
                    if (err) {
                        sails.log.error(err);
                        return res.json(err.status, { err: err });
                    }

                    return res.json(200, { status: 'success', message: 'Friendship terminated' });
                });
            }
        });
    },


    /**
     * `SocialController.accept()`
     *
     * ----------------------------------------------------------------------------------
     * @api {post} /api/v1/social/accept Accept a friend request
     * @apiName Accept
     * @apiDescription This is where the requestee accepts a friend request from a requester
     * @apiGroup Social
     *
     * @apiParam {Number} requester ID of the requester.
     * @apiParam {Number} requestee ID of the requestee.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Friend request accepted"
     *     }
     *
     * @apiUse RequesterIdNotProvidedError
     *
     * @apiUse RequesteeIdNotProvidedError
     *
     * @apiUse UserNotFoundError
     */
    accept: function(req, res) {
        if (!req.param('requester')) {
            return res.json(401, { status: 'error', err: 'No Requester id provided!' });
        }

        if (!req.param('requestee')) {
            return res.json(401, { status: 'error', err: 'No Requestee id provided!' });
        }

        User.findOne({ select: 'username', where: { id: req.param('requestee') } }).populate('friends').exec(function(err, user) {
            if (err) {
                sails.log.error(err);
                return res.json(err.status, { err: err });
            }

            if (!user) {
                return res.json(404, { status: 'error', err: 'No User with such id existing' });
            } else {

                user.friends.add(req.param('requester'));
                user.save(function(err) {
                    if (err) {
                        sails.log.error(err);
                        return res.json(err.status, { err: err });
                    }

                    return res.json(200, { status: 'success', message: 'Friend request accepted' });
                });
            }
        });
    },

    /**
     * `SocialController.createPost()`
     *
     * ----------------------------------------------------------------------------------
     * @api {post} /api/v1/social/post Create a new social post
     * @apiName CreatePost
     * @apiDescription This is where a new social post is created.
     * @apiGroup Social
     *
     * @apiParam {String} postText Text content of the post.
     * @apiParam {Number} owner User ID of the post creator.
     * @apiParam {String} [postImage] Url of images associated with the post.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "id": "59dce9c16b54d91c38847825"
     *     }
     *
     * @apiError PostOwnerIdNotProvided No post owner id provided.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Not Found
     *     {
     *       "status": "error",
     *       "err": "No Creator/Owner user id provided!"
     *     }
     *
     * @apiError PostContentNotProvided No post content provided.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Not Found
     *     {
     *       "status": "error",
     *       "err": "No post content provided!"
     *     }
     */
    createPost: function(req, res) {
        if (!req.param('owner')) {
            return res.json(401, { status: 'error', err: 'No Creator/Owner user id provided!' });
        }

        if (!req.param('postText')) {
            return res.json(401, { status: 'error', err: 'No post content provided!' });
        }
        SocialPosts.create(req.body).exec(function(err, post) {
            if (err) {
                sails.log.error(err);
                return res.json(err.status, { err: err });
            }

            if (post) {
                res.json(200, { status: 'success', id: post.id });
            }
        });
    },

    /**
     * `SocialController.uploadImage()`
     *
     * ----------------------------------------------------------------------------------
     * @api {post} /api/v1/social/upload Upload an image
     * @apiName UploadImage
     * @apiDescription This is where a social image is uploaded (Make sure image file extension is either jpg or png).
     * @apiGroup Social
     *
     * @apiParam {String} image Image file to be uploaded.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "bannerUrl": "https://accicloud.blob.core.windows.net/social/27ba91b3-ab78-4240-aa6c-a1f32230227c.jpg"
     *     }
     *
     * @apiError ImageNotUploaded No image uploaded.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Not Found
     *     {
     *       "status": "error",
     *       "err": "No image uploaded!"
     *     }
     */
    uploadImage: function(req, res) {
        if (req.method != 'POST') return res.notFound();

        var container = 'social';

        req.file('image')
            .upload({
                maxBytes: 5000000,
                adapter: require('skipper-azure'),
                key: process.env.AZURE_STORAGE_ACCOUNT,
                secret: process.env.AZURE_STORAGE_ACCESS_KEY,
                container: container
            }, function whenDone(err, uploadedFiles) {
                if (err) {
                    sails.log.error(err);
                    return res.negotiate(err);
                } else if (uploadedFiles.length === 0) {
                    return res.json(401, { status: 'error', err: 'No image uploaded!' });
                } else return res.ok({
                    status: 'success',
                    bannerUrl: process.env.AZURE_STORAGE_ACCOUNT_URL + container + '/' + uploadedFiles[0].fd
                });
            });

    },

    /**
     * `SocialController.updatePost()`
     *
     * ----------------------------------------------------------------------------------
     * @api {put} /api/v1/social/post Update a post
     * @apiName UpdatePost
     * @apiDescription This is where a social post is updated.
     * @apiGroup Social
     *
     * @apiParam {Number} id Post ID.
     * @apiParam {String} [postText] Text content of the post.
     * @apiParam {String} [postImage] Url of images associated with the post.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Post with id 59dce9d56b54d91c38847825 has been updated"
     *     }
     *
     * @apiUse PostIdNotProvidedError
     *
     * @apiUse PostNotFoundError
     */
    updatePost: function(req, res) {
        if (!req.param('id')) {
            return res.json(401, { status: "error", err: 'No Post id provided!' });
        } else {
            SocialPosts.findOne({ select: ['postText', 'postImage'], where: { id: req.param('id') } }).exec(function(err, post) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                if (!post) {
                    return res.json(404, { status: 'error', message: 'No Post with such id existing' });
                } else {

                    if (post.postImage && post.postImage !== req.param('postImage')) {
                        var image = post.postImage;
                        azureBlob.delete('social', image.split('/').reverse()[0]);
                    }

                    SocialPosts.update({ id: req.param('id') }, req.body).exec(function(err, data) {
                        if (err) {
                            sails.log.error(err);
                            return res.json(err.status, { err: err });
                        }

                        return res.json(200, { status: 'success', message: 'Post with id ' + req.param('id') + ' has been updated' });
                    });
                }
            });
        }
    },

    /**
     * `SocialController.deletePost()`
     *
     * ----------------------------------------------------------------------------------
     * @api {delete} /api/v1/social/post/:id Delete a post
     * @apiName DeletePost
     * @apiDescription This is where a social post is deleted
     * @apiGroup Social
     *
     * @apiParam {Number} id Post ID.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Post with id 59dce9d56b54d91c38847825 has been deleted'"
     *     }
     *
     * @apiUse PostIdNotProvidedError
     *
     * @apiUse PostNotFoundError
     */
    deletePost: function(req, res) {
        if (!req.param('id')) {
            return res.json(401, { status: "error", err: 'No Post id provided!' });
        } else {
            SocialPosts.findOne({ select: ['postText', 'postImage'], where: { id: req.param('id') } }).exec(function(err, post) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                if (!post) {
                    return res.json(404, { status: 'error', message: 'No Post with such id existing' });
                } else {
                    SocialPosts.destroy({ id: req.param('id') }, req.body).exec(function(err, data) {
                        if (err) {
                            sails.log.error(err);
                            return res.json(err.status, { err: err });
                        }

                        if (post.postImage) {
                            var image = post.postImage;
                            azureBlob.delete('social', image.split('/').reverse()[0]);
                        }

                        return res.json(200, { status: 'success', message: 'Post with id ' + req.param('id') + ' has been deleted' });
                    });
                }
            });
        }
    },

    /**
     * `SocialController.getPost()`
     *
     * ----------------------------------------------------------------------------------
     * @api {get} /api/v1/social/post/:id Get post(s)
     * @apiName GetPost
     * @apiDescription This is where a social post(s) is retrieved
     * @apiGroup Social
     *
     * @apiParam {Number} [id] Post ID.
     *
     * @apiSuccess {String} post Postresponse from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "59dce9d56b54d91c38847825",
     *       "postImage": "http://w............"
     *        .................................
     *     }
     *
     * @apiUse PostNotFoundError
     */
    getPost: function(req, res) {
        var page = 1;
        var limit = 25;

        if (req.param('page') > 1) {
            page = req.param('page');
        }

        if (req.param('limit') > 1) {
            limit = req.param('limit');
        }

        if (req.param('id')) {
            SocialPosts.findOne({ id: req.param('id') }).populate('comments').populate('likes').exec(function(err, post) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                if (!post) {
                    return res.json(204, { status: 'error', err: 'No Post with such id existing' })
                } else {
                    return res.json(200, post);
                }
            });
        } else {
            SocialPosts.find().populate('comments').populate('likes').paginate({ page: page, limit: limit }).exec(function(err, posts) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                return res.json(200, posts);
            });
        }
    },

    /**
     * `SocialController.searchPost()`
     *
     * ----------------------------------------------------------------------------------
     * @api {get} /api/v1/social/post/search Search for post(s)
     * @apiName SearchPost
     * @apiDescription This is where a social post is searched.
     * @apiGroup Social
     *
     * @apiParam {String} searchTerm Search term to be searched.
     * @apiParam {String} [page] Current page of the search result.
     * @apiParam {String} [limit] Number of search items per page.
     *
     * @apiSuccess {String} page Current page of the search result.
     * @apiSuccess {String} limit  Number of search items per page.
     * @apiSuccess {String} result  Result of the search.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "page": "1",
     *       "limit": "50",
     *       "result": [{}]
     *     }
     *
     * @apiUse SearchTermNotProvidedError
     *
     */
    searchPost: function(req, res) {
        var page = 1;
        var limit = 25;

        if (req.param('page') && req.param('page') > 1) {
            page = req.param('page');
        }

        if (req.param('limit')) {
            limit = req.param('limit');
        }

        if (!req.param('searchTerm')) {
            return res.json(401, { status: "error", err: 'No search term provided!' });
        } else {
            SocialPosts.find({ postText: { 'contains': req.param('searchTerm') } }).populate('comments').populate('likes').paginate({ page: page, limit: limit }).exec(function(err, posts) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                return res.json(200, { page: page, limit: limit, result: posts });
            });
        }
    },

    /**
     * `SocialController.unlikePost()`
     *
     * ----------------------------------------------------------------------------------
     * @api {post} /api/v1/social/post/unlike Unlike a post
     * @apiName UnlikePost
     * @apiDescription This is where a social post is unliked
     * @apiGroup Social
     *
     * @apiParam {String} id Post ID.
     * @apiParam {String} liker User id of the post liker.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Post unliked"
     *     }
     *
     * @apiUse PostIdNotProvidedError
     *
     * @apiUse PostNotFoundError
     */
    unlikePost: function(req, res) {
        if (!req.param('id')) {
            return res.json(401, { status: "error", err: 'No Post id provided!' });
        } else {
            SocialPosts.findOne({ select: 'postText', where: { id: req.param('id') } }).populate('likes').exec(function(err, post) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                if (!post) {
                    return res.json(200, { status: 'error', err: 'No Post with such id existing' });
                } else {

                    post.likes.remove(req.param('liker'));
                    post.save(function(err) {
                        if (err) {
                            sails.log.error(err);
                            return res.json(err.status, { err: err });
                        }

                        return res.json(200, { status: 'success', message: 'Post unliked' });
                    });
                }
            });
        }
    },

    /**
     * `SocialController.likePost()`
     *
     * ----------------------------------------------------------------------------------
     * @api {post} /api/v1/social/post/like Like a post
     * @apiName LikePost
     * @apiDescription This is where a social post is liked
     * @apiGroup Social
     *
     * @apiParam {String} id Post ID.
     * @apiParam {String} liker User id of the post liker.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Post liked"
     *     }
     *
     * @apiUse PostIdNotProvidedError
     *
     * @apiUse PostNotFoundError
     */
    likePost: function(req, res) {
        if (!req.body.id) {
            return res.json(401, { status: 'error', err: 'No Post id provided!' });
        } else {
            SocialPosts.findOne({ select: 'postText', where: { id: req.body.id } }).populate('likes').exec(function(err, post) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                if (!post) {
                    return res.json(200, { status: 'error', message: 'No Post with such id existing' });
                } else {

                    post.likes.add(req.body.liker);
                    post.save(function(err) {
                        if (err) {
                            sails.log.error(err);
                            return res.json(err.status, { err: err });
                        }

                        return res.json(200, { status: 'success', message: 'Post liked' });
                    });
                }
            });
        }
    },

    /**
     * `SocialController.createComment()`
     *
     * ----------------------------------------------------------------------------------
     * @api {post} /api/v1/social/comment Create a new comment
     * @apiName CreateComment
     * @apiDescription This is where a comment on post is created
     * @apiGroup Social
     *
     * @apiParam {String} comment The comment to be made on a post.
     * @apiParam {Number} owner User id of the commentor.
     * @apiParam {Number} post Post id of the post to be commented on.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  the comment id of the newly created comment.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "id": "59dce9c16b54d91c38847825"
     *     }
     *
     * @apiUse PostIdNotProvidedError
     *
     * @apiError OwnerIdNotProvided No Owner/User id provided.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Not Found
     *     {
     *       "status": "error",
     *       "err": "No post content provided!"
     *     }
     *
     *
     * @apiError CommentNotProvided No comment provided.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Not Found
     *     {
     *       "status": "error",
     *       "err": "No comment provided!"
     *     }
     */
    createComment: function(req, res) {
        if (!req.param('post')) {
            return res.json(401, { status: 'error', err: 'No Post id provided!' });
        }

        if (!req.param('owner')) {
            return res.json(401, { status: 'error', err: 'No Owner id provided!' });
        }

        if (!req.param('comment')) {
            return res.json(401, { status: 'error', err: 'No Comment provided!' });
        }

        SocialComments.create(req.body).exec(function(err, comment) {
            if (err) {
                sails.log.error(err);
                return res.json(err.status, { err: err });
            }

            if (post) {
                res.json(200, {
                    id: comment.id
                });
            }
        });

    },

    /**
     * `SocialController.updateComment()`
     *
     * ----------------------------------------------------------------------------------
     * @api {put} /api/v1/social/post Update a comment
     * @apiName UpdateComment
     * @apiDescription This is where a comment on post is updated.
     * @apiGroup Social
     *
     * @apiParam {Number} id Comment ID.
     * @apiParam {String} comment The comment to be made on a post.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Comment with id 59dce9d56b54d91c38847825 has been updated'"
     *     }
     *
     * @apiUse CommentIdNotProvidedError
     *
     * @apiUse CommentNotFoundError
     */
    updateComment: function(req, res) {
        if (!req.param('id')) {
            return res.json(401, { status: 'error', err: 'No Comment id provided!' });
        } else {
            SocialComments.findOne({ select: 'comment', where: { id: req.param('id') } }).exec(function(err, comment) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                if (!comment) {
                    return res.json(404, { status: 'error', err: 'No Comment with such id existing' });
                } else {
                    SocialComments.update({ id: req.param('id') }, req.body).exec(function(err, data) {
                        if (err) {
                            sails.log.error(err);
                            return res.json(err.status, { err: err });
                        }

                        return res.json(200, { status: 'success', message: 'Comment with id ' + req.param('id') + ' has been updated' });
                    });
                }
            });
        }
    },

    /**
     * `SocialController.deleteComment()`
     *
     * ----------------------------------------------------------------------------------
     * @api {delete} /api/v1/social/comment/:id Delete a comment
     * @apiName DeleteComment
     * @apiDescription This is where a comment on post is deleted.
     * @apiGroup Social
     *
     * @apiParam {Number} id Comment ID.
     *
     * @apiSuccess {String} status Status of the response from API.
     * @apiSuccess {String} message  Success message response from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "message": "Comment with id 59dce9d56b54d91c38847825 has been deleted'"
     *     }
     *
     * @apiUse CommentIdNotProvidedError
     *
     * @apiUse CommentNotFoundError
     */
    deleteComment: function(req, res) {
        if (!req.param('id')) {
            return res.json(401, { status: 'error', err: 'No Comment id provided!' });
        } else {
            SocialComments.findOne({ select: 'comment', where: { id: req.param('id') } }).exec(function(err, comment) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                if (!comment) {
                    return res.json(404, { status: 'error', err: 'No Comment with such id existing' });
                } else {
                    SocialComments.destroy({ id: req.param('id') }, req.body).exec(function(err, data) {
                        if (err) {
                            sails.log.error(err);
                            return res.json(err.status, { err: err });
                        }

                        return res.json(200, { status: 'success', message: 'Comment with id ' + req.param('id') + ' has been deleted' });
                    });
                }
            });
        }
    },

    /**
     * `SocialController.getComment()`
     *
     * ----------------------------------------------------------------------------------
     * @api {get} /api/v1/social/comment/:id Get comment(s)
     * @apiName GetComment
     * @apiDescription This is where a comment on post is retrieved.
     * @apiGroup Social
     *
     * @apiParam {Number} id Comment ID.
     *
     * @apiSuccess {String} comment Postresponse from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "59dce9d56b54d91c38847825",
     *       ".........": "...................."
     *        .................................
     *     }
     *
     * @apiUse CommentNotFoundError
     *
     */
    getComment: function(req, res) {
        if (req.param('id')) {
            SocialComments.findOne({ id: req.param('id') }).exec(function(err, comment) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                if (!comment) {
                    return res.json(204, { status: 'error', err: 'No Comment with such id existing' })
                } else {
                    return res.json(200, comment);
                }
            });
        } else {
            SocialComments.find().exec(function(err, posts) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                return res.json(200, posts);
            });
        }
    },

    /**
     * `SocialController.getFeed()`
     *
     * ----------------------------------------------------------------------------------
     * @api {get} /api/v1/social/feed/:id Get user's feed
     * @apiName GetFeed
     * @apiDescription This is where a user's feed is retrieved.
     * @apiGroup Social
     *
     * @apiParam {Number} id User id.
     *
     * @apiSuccess {String} comment Postresponse from API.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "59dce9d56b54d91c38847825",
     *       ".........": "...................."
     *        .................................
     *     }
     *
     */
    getFeed: function(req, res) {
        var offset, limit = 0;

        if (req.param('offset')) {
            offset = req.param('offset');
        }

        if (req.param('limit')) {
            limit = req.param('limit');
        }

        if (req.param('id')) {

            User.findOne({ select: ['username', 'friends'], where: { id: req.param('id') } })
                .populate('friends')
                .limit(limit)
                .skip(offset)
                .exec(function(err, user) {
                    if (err) {
                        sails.log.error(err);
                        return res.json(err.status, { err: err });
                    }

                    if (!user) {
                        return res.json(204, { status: 'error', err: 'No user with such id existing' });
                    } else {

                        var friends = [];
                        user.friends.forEach(function(friend) {
                            friends.push(friend.id);
                        });

                        friends.push(user.id)
                        // check if the user has any friends yet
                        if (friends.length > 0) {
                            SocialPosts.find({
                                    owner: friends
                                }).populate('comments')
                                .populate('likes')
                                .populate('owner')
                                .limit(limit)
                                .skip(offset)
                                .sort('createdAt DESC')
                                .exec(function(err, posts) {
                                    if (err) {
                                        sails.log.error(err);
                                        return res.json(err.status, { err: err });
                                    }
                                    return res.json(200, posts);
                                });
                        } else {
                            return res.json(204, { status: 'error', err: 'User has no friends yet' });
                        }
                    }

                });
        }
    },

    /**
     * `SocialController.searchComment()`
     *
     * ----------------------------------------------------------------------------------
     * @api {get} /api/v1/social/comment/search Search for post(s)
     * @apiName SearchComment
     * @apiDescription This is where a comment on post is searched.
     * @apiGroup Social
     *
     * @apiParam {String} searchTerm Search term to be searched.
     * @apiParam {String} [limit]  Number of search items per page.
     * @apiParam {String} [result]  Result of the search.
     *
     * @apiSuccess {String} page Current page of the search result.
     * @apiSuccess {String} limit  Number of search items per page.
     * @apiSuccess {String} result  Result of the search.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "page": "1",
     *       "limit": "50",
     *       "result": [{}]
     *     }
     *
     * @apiUse SearchTermNotProvidedError
     */
    searchComment: function(req, res) {
        var page = 1;
        var limit = 25;

        if (req.param('page') && req.param('page') > 1) {
            page = req.param('page');
        }

        if (req.param('limit')) {
            limit = req.param('limit');
        }

        if (!req.param('searchTerm')) {
            return res.json(401, { status: 'error', err: 'No search term provided!' });
        } else {
            SocialComments.find({ comment: { 'contains': req.param('searchTerm') } }).paginate({ page: page, limit: limit }).exec(function(err, comments) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                return res.json(200, { page: page, limit: limit, result: comments });
            });
        }
    },

    /**
     * `SocialController.getCount()`
     *
     * ----------------------------------------------------------------------------------
     * @api {get} /api/v1/socialcount Get social counts
     * @apiName GetCount
     * @apiDescription This is where social counts are obtained.
     * @apiGroup Social
     */
    getCount: function(req, res) {

        var socialCounts = {};

        SocialPosts.count().exec(function(err, posts) {
            if (err) {
                sails.log.error(err);
                return res.json(err.status, { err: err });
            }

            socialCounts.posts = posts;

            SocialComments.count().exec(function(err, comments) {
                if (err) {
                    sails.log.error(err);
                    return res.json(err.status, { err: err });
                }

                socialCounts.comments = comments;

                return res.json(200, socialCounts);
            });
        });
    },
};
