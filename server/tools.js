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
		twitter: {
			followersCount: 0,
			statusesCount: 0
		},
		reddit: {
			followersCount: 0
		}
	};
	this.links = coin.links;
	this.development = "coming soon";
	this.network = "coming soon";
  },
  sortByParam: function (listOfCoins, param) {
  	
		if (typeof listOfCoins[param] == "number" || typeof listOfCoins[parametr] == "string") {
			arr.sort((a, b) => {
  				if (a[param] > b[param]) return 1;
  				if (a[param] < b[param]) return -1;
  				return 0;
			});
		} else {
			console.log(`Parametr ${param} isn't number or string...`);
		}

		return listOfCoins;
  	
  }
};

'use strict';

let arr = [{
  id: 1,
  name: "Jack"
}, {
  id: 5,
  name: "Bonny"
}, {
  id: 3,
  name: "Alice"
}];

let SOME_FIELD = 'name';
arr.sort((a, b) => {
  if (a[SOME_FIELD] > b[SOME_FIELD]) return 1;
  if (a[SOME_FIELD] < b[SOME_FIELD]) return -1;
  return 0;
});

console.log(arr);