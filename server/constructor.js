module.exports = {
  coin: function (coin) {
  	// console.log(coin)
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
			
		},
		reddit: {
			
		}
	};
	this.development = {};
	this.network = {};
  }
};