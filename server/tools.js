'use strict';

const numeral = require('numeral');
const _ = require('lodash');


module.exports = {
  	percentChange: function (newValue, oldValue) {
  		return _.round((newValue - oldValue) / newValue, 6);
  	}
};