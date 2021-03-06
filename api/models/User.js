/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {

  tableName: 'users',
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    balance: {
      type: 'number',
      required: true
    },
    orders: {
      collection: 'order',
      via: 'user'
    }
  },

  customToJSON: function() {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['createdAt', 'updatedAt'])
  }
};
