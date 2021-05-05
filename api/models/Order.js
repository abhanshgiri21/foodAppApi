module.exports = {
  tableName: 'orders',
  attributes: {
    user: {
      model: 'user'
    },
    restaurant: {
      model: 'restaurant'
    },
    dish: {
      model: 'menu'
    },
    amount: {
      type: 'number',
      required: true
    }
  },

  customToJSON: function() {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['updatedAt'])
  }
};
