'use strict'

const INTERVAL = 600000;
// const INTERVAL = 10000;

const path = require('path');
const fs = require('fs')
const request = require("superagent");
const tools = require('./tools');
const Coin = require('./Coin');
const urls = require('./data/urls');
const creds = require('../creds');
const numeral = require('numeral');
const _ = require('lodash');

const Twitter = require('twitter');

const COINS_PATH = path.join(__dirname, 'data', 'coins.json');
const LIST_PATH = path.join(__dirname, 'data', 'listOfCoins.json');
const LIST_PREV_PATH = path.join(__dirname, 'data', 'listOfCoinsPrev.json');


const clientTwitter = new Twitter(creds.twitter);

if (!fs.existsSync(path.join(__dirname, 'data', 'history'))) {
	fs.mkdirSync(path.join(__dirname, 'data', 'history'));
}

run();

async function run() {
	try {
		let coins = JSON.parse(fs.readFileSync(COINS_PATH, 'utf8'));
		let list;
		let listPrev;

		if (fs.existsSync(LIST_PATH)) {
			list = JSON.parse(fs.readFileSync(LIST_PATH, 'utf8'));
			listPrev = _.cloneDeep(list);
			fs.writeFileSync(LIST_PREV_PATH, JSON.stringify(list, null, 2));
		} else {
			list = coins.map(item => new Coin(item));
			listPrev = _.cloneDeep(list);
			fs.writeFileSync(LIST_PREV_PATH, JSON.stringify(list, null, 2));
		}

		console.log(`Start fetching info for ${coins.length} coins...`);

		for (let [index, coin] of list.entries()) {
			console.log(`\nProcessing ${coin.id}...`);

			// Market Data
			try {
				console.log(`CoinMarketCap...`);

				let response = await request.get(urls.coinMarketCap + coin.id);
				coin.market.coinMarketCap.marketVolumeUSD = +response.body[0].market_cap_usd;
			} catch (e) {
				console.error(`Error while fetching info for ${coin.id} from CoinMarketCap:`, e.response.error, 'Skipped');
			}

			// Twitter Data
			try {
				console.log(`Twitter...`);

				let twitterResponse = await clientTwitter.get('users/show', coins[index].twitter)
				coin.social.twitter.followersCount = twitterResponse.followers_count;
				coin.social.twitter.statusesCount = twitterResponse.statuses_count;
				coin.social.twitter.creationDate = new Date(twitterResponse.created_at).getTime();

				console.log(twitterResponse.created_at);

	    		console.log(`Followers on twitter for ${coin.id}: ${twitterResponse.followers_count}`);
	    		console.log(`Tweets & replies for ${coin.id}: ${twitterResponse.statuses_count}`);
			} catch (e) {
				console.error(`Error while fetching info for ${coin.id} from Twitter:`, e.response.error, 'Skipped');
			}

			// Reddit Data
			try {
				console.log('Reddit...');

				let redditResponse = await request.get(urls.reddit + coins[index].reddit.subreddit + "/top.json?sort=top&t=day&limit=1");
				coin.social.reddit.followersCount = redditResponse.body.data.children[0].data.subreddit_subscribers;
				coin.social.reddit.creationDate = redditResponse.body.data.children[0].data.created_utc;
				console.log(`Followers on Reddit for ${coin.id}: ${coin.social.reddit.followersCount}`);
				console.log(`Creation date for Reddit for ${coin.id}: ${coin.social.reddit.creationDate} ${redditResponse.body.data.children[0].data.created_utc}`);
				
			} catch (e) {
				console.error(`Error while fetching info for ${coin.id} from Reddit:`, e, 'Skipped');
			}

		}

		const dateNow = Date.now();
		const DATE_NOW_PATH = path.join(__dirname, 'data', 'history', dateNow + '.json');
		fs.writeFileSync(DATE_NOW_PATH, JSON.stringify(list, null, 2));

		tools.socialIndex(list);

		for (let [index, coin] of list.entries()) {
			list[index].social.indexDelta = tools.percentChange(list[index].social.index, listPrev[index].social.index);
			list[index].social.twitter.followersCountDelta = tools.percentChange(list[index].social.twitter.followersCount, listPrev[index].social.twitter.followersCount);
			list[index].social.twitter.statusesCountDelta = tools.percentChange(list[index].social.twitter.statusesCount, listPrev[index].social.twitter.statusesCount);
			list[index].social.reddit.followersCountDelta = tools.percentChange(list[index].social.reddit.followersCount, listPrev[index].social.reddit.followersCount);
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