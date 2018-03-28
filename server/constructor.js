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
			followersCount: 0,
			statusesCount: 0
		},
		reddit: "coming soon"
	};
	this.development = "coming soon";
	this.network = "coming soon";
  }
};