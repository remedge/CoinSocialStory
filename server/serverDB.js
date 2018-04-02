'use strict'

const INTERVAL = 600000;

const path = require('path');
const fs = require('fs')
const request = require("superagent");
const tools = require('./tools');
const urls = require('./data/urls');
const creds = require('../creds');
const numeral = require('numeral');

const Twitter = require('twitter');

const COINS_PATH = path.join(__dirname, 'data', 'coins.json');
const LIST_PATH = path.join(__dirname, 'data', 'listOfCoins.json');

const clientTwitter = new Twitter(creds.twitter);

run();

async function run() {
	try {
		let coins = JSON.parse(fs.readFileSync(COINS_PATH, 'utf8'));
		let list;

		if (fs.existsSync(LIST_PATH)) {
			list = JSON.parse(fs.readFileSync(LIST_PATH, 'utf8'));
		} else {
			list = coins.map(item => new tools.coin(item));
		}

		console.log(`Start fetching info for ${coins.length} coins...`);

		for (let [index, coin] of list.entries()) {
			console.log(`\nProcessing ${coin.id}...`);

			// Market Data
			try {
				console.log(`CoinMarketCap...`);

				let response = await request.get(urls.coinMarketCap + coin.id);
				coin.market.coinMarketCap.marketVolumeUSD = numeral(response.body[0].market_cap_usd).format('0,0[.]00 $');
			} catch (e) {
				console.error(`Error while fetching info for ${coin.id} from CoinMarketCap:`, e.response.error, 'Skipped');
			}

			// Twitter Data
			try {
				console.log(`Twitter...`);

				let twitterResponse = await clientTwitter.get('users/show', coins[index].twitter)
				coin.social.twitter.followersCount = numeral(twitterResponse.followers_count).format('0,0');
				coin.social.twitter.statusesCount = numeral(twitterResponse.statuses_count).format('0,0');

	    		console.log(`Followers on twitter for ${coin.id}: ${twitterResponse.followers_count}`);
	    		console.log(`Tweets & replies for ${coin.id}: ${twitterResponse.statuses_count}`);
			} catch (e) {
				console.error(`Error while fetching info for ${coin.id} from Twitter:`, e.response.error, 'Skipped');
			}

			// Reddit Data
			try {
				console.log('Reddit...');

				let redditResponse = await request.get(urls.reddit + coins[index].reddit.subreddit + "/top.json?sort=top&t=day&limit=1");
				coin.social.reddit.followersCount = numeral(redditResponse.body.data.children[0].data.subreddit_subscribers).format('0,0');
				console.log(`Followers on Reddit for ${coin.id}: ${coin.social.reddit.followersCount}`);
				
			} catch (e) {
				console.error(`Error while fetching info for ${coin.id} from Reddit:`, e, 'Skipped');
			}
		}

		console.log(`Saving data to ${LIST_PATH}...`);
		fs.writeFileSync(LIST_PATH, JSON.stringify(list, null, 2));
		console.log(`Data successfully fetched`);
		console.log(`Next fetching after ${INTERVAL / 1000} secs\n\n`);

	} catch (e) {
		console.error(e);
	}
	setTimeout(run, INTERVAL);
}







