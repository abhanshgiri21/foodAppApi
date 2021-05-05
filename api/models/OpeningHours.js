module.exports = {
  tableName: 'opening_hours',
  attributes: {
    start: {
      type: 'number',
      required: true
    },
    end: {
      type: 'number',
      required: true
    },
    day: {
      type: 'number',
      required: true
    },
    restaurant: {
      model: 'restaurant'
    }
  },

  customToJSON: function() {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['createdAt', 'updatedAt'])
  }
};
