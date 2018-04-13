'use strict'

const INTERVAL = 3600000;
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
const octokit = require('@octokit/rest')();

const Twitter = require('twitter');
// GITHUB
octokit.authenticate(creds.github);

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
			// list.map(item => new Coin(item));
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
				coin.market.coinMarketCap.priceUSD = +response.body[0].price_usd;
				coin.market.coinMarketCap.VolumeUSD = +response.body[0]['24h_volume_usd'];

				// coin.market.coinMarketCap.index =  (coin.market.coinMarketCap.priceUSD + coin.market.coinMarketCap.marketVolumeUSD - coin.market.coinMarketCap.VolumeUSD * list[0].market.coinMarketCap.marketVolumeUSD / list[0].market.coinMarketCap.VolumeUSD) / 10000;
				coin.market.coinMarketCap.index = (coin.market.coinMarketCap.marketVolumeUSD - coin.market.coinMarketCap.VolumeUSD * (list[0].market.coinMarketCap.priceUSD - list[0].market.coinMarketCap.marketVolumeUSD ) / list[0].market.coinMarketCap.VolumeUSD) / 1000000000;


			} catch (e) {
				// console.error(`Error while fetching info for ${coin.id} from CoinMarketCap:`, e, 'Skipped');
				console.error(`Error while fetching info for ${coin.id} from CoinMarketCap:`, e.response.error, 'Skipped');
			}

			// Twitter Data
			try {
				console.log(`Twitter...`);

				let twitterResponse = await clientTwitter.get('users/show', coins[index].twitter)
				coin.social.twitter.followersCount = twitterResponse.followers_count;
				coin.social.twitter.statusesCount = twitterResponse.statuses_count;
				coin.social.twitter.creationDate = new Date(twitterResponse.created_at).getTime();

	    		console.log(`Followers on twitter for ${coin.id}: ${twitterResponse.followers_count}`);
	    		console.log(`Tweets & replies for ${coin.id}: ${twitterResponse.statuses_count}`);
	    		console.log(`Creation time of twitter for ${coin.id}: ${twitterResponse.created_at}`);
			} catch (e) {
				console.error(`Error while fetching info for ${coin.id} from Twitter:`, e.response.error, 'Skipped');
				// console.error(`Error while fetching info for ${coin.id} from Twitter:`, e, 'Skipped');
			}

			// Reddit Data
			try {
				console.log('Reddit...');

				let redditResponse = await request.get(urls.reddit + coins[index].reddit.subreddit + "/top.json?sort=top&t=day&limit=1");
				coin.social.reddit.followersCount = redditResponse.body.data.children[0].data.subreddit_subscribers;
				coin.social.reddit.creationDate = redditResponse.body.data.children[0].data.created_utc;

				console.log(`Followers on Reddit for ${coin.id}: ${coin.social.reddit.followersCount}`);
				console.log(`Creation date for Reddit for ${coin.id}: ${coin.social.reddit.creationDate}`);	
			} catch (e) {
				console.error(`Error while fetching info for ${coin.id} from Reddit:`, e, 'Skipped');
			}

			// GitHub Data
			// console.log(coins[index]);
			if (coins[index].gitHub) {
				try {
					console.log('GitHub...');

					let reposCount;
					let watchersCount = 0;
					let forksCount = 0;
					let size = 0;

					let repos = await fetchAll(octokit.repos.getForUser, {username: coins[index].gitHub.user});

					reposCount = repos.length;

					for (let repo of repos) {
						watchersCount += repo.watchers_count;
						forksCount += repo.forks_count;
						size += repo.size;
					}

					coin.development.gitHub.reposCount = reposCount;
					coin.development.gitHub.watchersCount = watchersCount;
					coin.development.gitHub.forksCount = forksCount;
					coin.development.gitHub.size = size;

					coin.development.gitHub.index = watchersCount + 2 * forksCount - size * (list[0].development.gitHub.watchersCount - 2 * list[0].development.gitHub.forksCount) / list[0].development.gitHub.size;
					coin.development.gitHub.index = coin.development.gitHub.index / 1000;

					console.log(`Development index for ${coin.name}: ${coin.development.gitHub.index}`);
					console.log(`Total repositories for ${coin.name}: ${coin.development.gitHub.reposCount}`);
					console.log(`Total watchers for ${coin.name}: ${coin.development.gitHub.watchersCount}`);
					console.log(`Total forks for ${coin.name}: ${coin.development.gitHub.forksCount}`);
					console.log(`Total size for ${coin.name}: ${coin.development.gitHub.size}`);
					
				} catch (e) {
					console.error(`Error while fetching info for ${coin.id} from GitHub:`, e, 'Skipped');
				}
			}

			// TOTAL INDEX
			coin.index = (coin.social.index + coin.market.coinMarketCap.index + coin.development.gitHub.index) / 3;
			console.log(`Total index: ${coin.index}`);
		}

		// Calculate social index for coins
		for (var i = 0; i < list.length; i++) {
			list[i] = new Coin(list[i]);
			list[i].calcSocialIndex();
		}
		
		// Save data to the history
		// const dateNow = Date.now();
		// const DATE_NOW_PATH = path.join(__dirname, 'data', 'history', dateNow + '.json');
		// fs.writeFileSync(DATE_NOW_PATH, JSON.stringify(list, null, 2));

		// Calculate percent changes for all parametrs
		console.log(list[0].social.index);
		for (let [index, coin] of list.entries()) {

			// PRICE INDEX
			list[index].market.coinMarketCap.indexDelta = tools.percentChange(list[index].market.coinMarketCap.index, listPrev[index].market.coinMarketCap.index);
			list[index].market.coinMarketCap.marketVolumeUSDDelta = tools.percentChange(list[index].market.coinMarketCap.marketVolumeUSD, listPrev[index].market.coinMarketCap.marketVolumeUSD);
			list[index].market.coinMarketCap.priceUSDDelta = tools.percentChange(list[index].market.coinMarketCap.priceUSD, listPrev[index].market.coinMarketCap.priceUSD);
			list[index].market.coinMarketCap.VolumeUSDDelta = tools.percentChange(list[index].market.coinMarketCap.VolumeUSD, listPrev[index].market.coinMarketCap.VolumeUSD);

			// SOCIAL INDEX
			list[index].social.indexDelta = tools.percentChange(list[index].social.index, listPrev[index].social.index);
			list[index].social.twitter.followersCountDelta = tools.percentChange(list[index].social.twitter.followersCount, listPrev[index].social.twitter.followersCount);
			list[index].social.twitter.statusesCountDelta = tools.percentChange(list[index].social.twitter.statusesCount, listPrev[index].social.twitter.statusesCount);
			list[index].social.reddit.followersCountDelta = tools.percentChange(list[index].social.reddit.followersCount, listPrev[index].social.reddit.followersCount);

			// DEVELOPMENT INDEX
			list[index].development.gitHub.indexDelta = tools.percentChange(list[index].development.gitHub.index, listPrev[index].development.gitHub.index);
			list[index].development.gitHub.reposCountDelta = tools.percentChange(list[index].development.gitHub.reposCount, listPrev[index].development.gitHub.reposCount);
			list[index].development.gitHub.watchersCountDelta = tools.percentChange(list[index].development.gitHub.watchersCount, listPrev[index].development.gitHub.watchersCount);
			list[index].development.gitHub.forksCountDelta = tools.percentChange(list[index].development.gitHub.forksCount, listPrev[index].development.gitHub.forksCount);
			list[index].development.gitHub.sizeDelta = tools.percentChange(list[index].development.gitHub.size, listPrev[index].development.gitHub.size);

			// TOTAL INDEX
			list[index].indexDelta = tools.percentChange(list[index].index, listPrev[index].index);
		}

		// Saving data
		console.log(`Saving data to ${LIST_PATH}...`);
		fs.writeFileSync(LIST_PATH, JSON.stringify(list, null, 2));
		console.log(`Data successfully fetched`);
		console.log(`Next fetching after ${INTERVAL / 1000} secs\n\n`);

	} catch (e) {
		console.error(e);
	}
	setTimeout(run, INTERVAL);
}


async function fetchAll(method, params) {
	params.per_page = 100;
	let response = await method(params);
	let {data} = response;
	while (octokit.hasNextPage(response)) {
		response = await octokit.getNextPage(response)
		data = data.concat(response.data)
	}
	return data
}