/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {
  attributes: {
    content: {
      type: 'string',
      required: true,
      description: 'Content of question',
      maxLength: 1000,
    },
    //associations
    userId: {
      type: 'string',
      required: true,
      description: 'User ID',
    },
    departments: {
      collection: 'department',
      via: 'roles'
    },
    answers: {
      collection: 'answer',
      via: 'roles'
    },
    comments: {
      collection: 'comment',
      via: 'roles'
    }
  },
};
