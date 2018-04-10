'use strict';

const objectPath = require("object-path");
const numeral = require('numeral');
const _ = require('lodash');


module.exports = {
  	socialIndex: function (listOfCoins) {
  		for (let coin of listOfCoins) {
  			let twitterTime = Date.now() - coin.social.twitter.creationDate;
  			let twitterFollowers = numeral(coin.social.twitter.followersCount).value();
  			let twitterStatuses = numeral(coin.social.twitter.statusesCount).value();
  			let redditTime = Date.now() - coin.social.reddit.creationDate;
  			let redditFollowers = numeral(coin.social.reddit.followersCount).value();

  			coin.social.index = ( (twitterStatuses + twitterFollowers) / twitterTime + redditFollowers / redditTime) * 1000 * 3600;
  		}
  	},
  	percentChange: function (newValue, oldValue) {
  		return _.round((newValue - oldValue) / newValue, 6);
  	}
};