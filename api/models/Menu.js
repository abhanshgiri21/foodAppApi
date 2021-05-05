module.exports = {
  tableName: 'menu',
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    price: {
      type: 'number',
      required: true
    },
    restaurant: {
      model: 'restaurant'
    },
    orders: {
      collection: 'order',
      via: 'dish'
    }
  },

  customToJSON: function() {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['createdAt', 'updatedAt'])
  }
};
