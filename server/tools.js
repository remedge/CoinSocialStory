const objectPath = require("object-path");
const numeral = require('numeral');
const _ = require('lodash');

module.exports = {
  	coin: function (coin) {
	  	this.id = coin.id
		this.name = coin.name;
		this.symbol = coin.symbol;
		this.market = {
			coinMarketCap: {
				marketVolumeUSD: ''
			}
		};
		this.social = {
			index: 0,
			indexDelta: 0,
			twitter: {
				followersCount: 0,
				followersCountDelta: 0,
				statusesCount: 0,
				statusesCountDelta: 0,
				creationDate: 0
			},
			reddit: {
				followersCount: 0,
				followersCountDelta: 0,
				creationDate: 0
			}
		};
		this.links = coin.links;
		this.development = "coming soon";
		this.network = "coming soon";
	},
	sortByParam: function (listOfCoins, param, type) {

		if (type == "number") {
			listOfCoins.sort((a, b) => {
				if (numeral(objectPath.get(a, param)).value() < numeral(objectPath.get(b, param)).value()) return 1;
				if (numeral(objectPath.get(a, param)).value() > numeral(objectPath.get(b, param)).value()) return -1;
				return 0;
			});
		} else if (type == "string") {
			listOfCoins.sort((a, b) => {
    			if(objectPath.get(a, param) < objectPath.get(b, param)) return -1;
    			if(objectPath.get(a, param) > objectPath.get(b, param)) return 1;
    			return 0;
    		});
		} else {
			console.log(`Param ${objectPath.get(listOfCoins[0], param)} isn't number or string...`);
			console.log(`It is ${typeof objectPath.get(listOfCoins[0], param)}`);
		}

		return listOfCoins;
  	
  	},
  	socialIndex: function (listOfCoins) {
  		for (let coin of listOfCoins) {
  			coin.social.index = (numeral(coin.social.twitter.followersCount).value() + numeral(coin.social.reddit.followersCount).value()) / 2;
  		}
  	},
  	percentChange: function (newValue, oldValue) {
  		return _.round((newValue - oldValue) / newValue, 6);
  	}
};