module.exports = {
  tableName: 'restaurants',
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    balance: {
      type: 'number',
      required: true
    },
    menuItems: {
      collection: 'menu',
      via: 'restaurant'
    },
    openingHours: {
      collection: 'openingHours',
      via: 'restaurant'
    },
    orders: {
      collection: 'order',
      via: 'restaurant'
    }
  },

  customToJSON: function() {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['createdAt', 'updatedAt'])
  }
};
