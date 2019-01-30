/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {
  dontUseObjectIds: true,
  attributes: {
    name: {
      type: 'string',
      required: true,
      description: 'Full representation of the department name',
      maxLength: 120,
      example: 'Some name'
    },
    // associations
    roles: {
      collection: 'question',
      via: 'departments'
    }
  },
  async findNextId() {
    let id = await Department.count();
    return id+1;
  }
};
