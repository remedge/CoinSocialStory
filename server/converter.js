'use strict';

module.exports = {
  	dataForUI: function (serverData) {
  		let dataForUI = [];

  		for(let coin of serverData) {
  			dataForUI.push({
				id: coin.id || '',
				name: coin.name || '',
				symbol: coin.symbol || '',

				CMCmarketVolumeUSD: coin.market.marketVolumeUSD || '',

				socialIndex: coin.social.index || 0,
				socialIndexDelta: coin.social.indexDelta || 0,

				twitterFollowersCount: coin.social.twitter.followersCount || 0,
				twitterFollowersCountDelta: coin.social.twitter.followersCountDelta || 0,
				twitterStatusesCount: coin.social.twitter.statusesCount || 0,
				twitterStatusesCountDelta: coin.social.twitter.statusesCountDelta || 0,
				twitterCreationDate: coin.social.twitter.creationDate || 0,

				redditFollowersCount: coin.social.reddit.followersCount || 0,
				redditFollowersCountDelta: coin.social.reddit.followersCountDelta || 0,
				redditCreationDate: coin.social.reddit.creationTime || 0,
				
				links: coin.links,
				development: coin.development,
				network: coin.network
			})
  		}
  		return dataForUI;
  	}
};