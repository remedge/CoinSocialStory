'use strict';

const numeral = require('numeral');


class Coin {
	constructor(coin) {
		this.id = coin.id;
		this.name = coin.name;
		this.symbol = coin.symbol;

		if (coin.market) {
			this.market = {
				coinMarketCap: {
					index: coin.market.coinMarketCap.index || 0,
					indexDelta: coin.market.coinMarketCap.indexDelta || 0,

					marketVolumeUSD: coin.market.coinMarketCap.marketVolumeUSD || '',
					marketVolumeUSDDelta: coin.market.coinMarketCap.marketVolumeUSDDelta || '',

					priceUSD: coin.market.coinMarketCap.priceUSD || 0,
					priceUSDDelta: coin.market.coinMarketCap.priceUSDDelta || 0,

					VolumeUSD: coin.market.coinMarketCap.VolumeUSD || 0,
					VolumeUSDDelta: coin.market.coinMarketCap.VolumeUSDDelta || 0
				}
			};
		} else {
			this.market = {
				coinMarketCap: {
					index: 0,
					indexDelta: 0,

					marketVolumeUSD: '',
					marketVolumeUSDDelta: '',

					priceUSD: 0,
					priceUSDDelta: 0,

					VolumeUSD: 0,
					VolumeUSDDelta: 0
				}
			};
		}

		if (coin.social) {
			this.social = {
				index: coin.social.index || 0,
				indexDelta: coin.social.indexDelta || 0,
				twitter: {
					followersCount: coin.social.twitter.followersCount || 0,
					followersCountDelta: coin.social.twitter.followersCountDelta || 0,
					statusesCount: coin.social.twitter.statusesCount || 0,
					statusesCountDelta: coin.social.twitter.statusesCountDelta || 0,
					creationDate: coin.social.twitter.creationDate || 0
				},
				reddit: {
					followersCount: coin.social.reddit.followersCount || 0,
					followersCountDelta: coin.social.reddit.followersCountDelta || 0,
					creationDate: coin.social.reddit.creationTime || 0
				}
			};
		} else {
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
		}

		this.links = coin.links;
		if (coin.development) {
			this.development = {
				gitHub: {
					index: coin.development.gitHub.index || 0,
					indexDelta: coin.development.gitHub.indexDelta || 0,

					reposCount: coin.development.gitHub.reposCount || 0,
					reposCountDelta: coin.development.gitHub.reposCountDelta || 0,

					commits: coin.development.gitHub.commits || 0,
					commitsDelta: coin.development.gitHub.commitsDelta || 0,

					contributers: coin.development.gitHub.contributers || 0,
					contributersDelta: coin.development.gitHub.contributersDelta || 0,

					followers: coin.development.gitHub.followers || 0,
					followersDelta: coin.development.gitHub.followersDelta || 0
				}
			};
		} else {
			this.development = {
				gitHub: {
					index: 0,
					indexDelta: 0,

					reposCount: 0,
					reposCountDelta: 0,

					commits: 0,
					commitsDelta: 0,

					contributers: 0,
					contributersDelta: 0,

					followers: 0,
					followersDelta: 0
				}
			};
		}
		this.network = "coming soon";
	}

	calcSocialIndex() {
		let twitterTime = Date.now() - this.social.twitter.creationDate;
		let twitterFollowers = numeral(this.social.twitter.followersCount).value();
		let twitterStatuses = numeral(this.social.twitter.statusesCount).value();
		let redditTime = Date.now() - this.social.reddit.creationDate;
		let redditFollowers = numeral(this.social.reddit.followersCount).value();

		this.social.index = ( (twitterStatuses + twitterFollowers) / twitterTime + redditFollowers / redditTime) * 1000 * 3600;

		console.log(this.social.index);
  	}

	percentChange() {}
	dumpForRender() {
		return {}; // -> pug
	}
}

module.exports = Coin;

