'use strict';


class Coin {
	constructor(coin) {
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
	}

	calcSocialIndex() {}
	percentChange() {}
	dumpForRender() {
		return {}; // -> pug
	}
}

module.exports = Coin;

