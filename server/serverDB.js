'use strict'

const INTERVAL = 5000;

const path = require('path');
const fs = require('fs')
const request = require("superagent");
const constructor = require('./constructor');
const urls = require('./data/urls');

const COINS_PATH = path.join(__dirname, 'data', 'coins.json');
const LIST_PATH = path.join(__dirname, 'data', 'listOfCoins.json');

run();

async function run() {
	try {
		let coins = JSON.parse(fs.readFileSync(COINS_PATH, 'utf8'));
		let list;

		if (fs.existsSync(LIST_PATH)) {
			list = JSON.parse(fs.readFileSync(LIST_PATH, 'utf8'));
		} else {
			list = coins.map(item => new constructor.coin(item));
		}

		console.log(`Start fetching info for ${coins.length} coins...`);

		for (let coin of list) {
			try {
				console.log(`Processing ${coin.id}...`);
				let response = await request.get(urls.coinMarketCap + coin.id);
				coin.market.coinMarketCap.marketVolumeUSD = response.body[0].market_cap_usd;
			} catch (e) {
				console.error(`Error while fetching ${coin.id}:`, e.response.error, 'Skipped');
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






// let listOfCoins = JSON.parse(fs.readFileSync('listOfCoins.json', 'utf8'))
// let urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'))

// console.log("yo!")

// function createCoins () {
// 	const coinsInit = 'https://api.coinmarketcap.com/v1/ticker/?limit=15'
// 	request({
// 	    url: coinsInit,
// 	    json: true
// 	}, function (err, res, body) {
// 	    if (!err && res.statusCode === 200) {
// 	    	let coins = []
// 	    	body.forEach(function (item, i) {
// 	    		coins.push({id: item.id, name: item.name, symbol: item.symbol})
// 	    	})
// 	       	console.log(body[0])
// 			fs.writeFileSync('coins.json', JSON.stringify(coins), 'utf8');
// 	    }
// 	})
// }

// function createListOfCoins (listOfCoins) {
// 	let coins = JSON.parse(fs.readFileSync('coins.json', 'utf8'))
	
// 	coins.forEach(function (coin, i) {
// 		listOfCoins.push(new constructor.coin(coin))
// 	})
// 	console.log('listOfCoins:' + listOfCoins)
// 	return listOfCoins;
// }

// listOfCoins = createListOfCoins([])

// listOfCoins.forEach(function(coin, i) {
// 	request({
// 	    url: urls.coinMarketCap + coin.id,
// 	    json: true
// 	}, function (err, res, body) {
// 	    if (!err && res.statusCode === 200) {
// 	    	listOfCoins[i].market.coinMarketCap.marketVolumeUSD = body[0].market_cap_usd
// 	        fs.writeFileSync('listOfCoins.json', JSON.stringify(listOfCoins), 'utf8')
// 	    }
// 	})
// })


// let date = Date.now()
// console.log(date)



