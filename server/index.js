'use strict'

const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const tools = require('./tools');
const converter = require('./converter');
const numeral = require('numeral');
const objectPath = require("object-path");
const _ = require('lodash');
const bodyParser = require('body-parser');

const LIST_OF_COINS = path.join(__dirname, 'data', 'listOfCoins.json');
const VIEWS_DIR = path.join(__dirname, '..', 'views');

const INTERVAL = 3600000;
// const INTERVAL = 10000;


console.log("yo!");

let listOfCoins = JSON.parse(fs.readFileSync(LIST_OF_COINS, 'utf8'));
// console.log(converter.dataForUI(listOfCoins));

app.use(bodyParser.json({extended: true}));
app.use(express.static('build'));
app.set('views', VIEWS_DIR);
app.set('view engine', 'pug');

app.use((req, res, next) => {
	res.locals = res.locals || {};
	res.locals.numeral = numeral;
	return next();
});

app.get('/', (req, res) => {

	const keys = {
		'name': 'name',

		'price_index': 'market.coinMarketCap.index',
		'price': 'market.coinMarketCap.priceUSD',
		'market_volume': 'market.coinMarketCap.marketVolumeUSD',
		'volume': 'market.coinMarketCap.VolumeUSD',

		'social': 'social.index',
		'twitter_followers': 'social.twitter.followersCount',
		'twitter_statuses': 'social.twitter.statusesCount',
		'reddit_followers': 'social.reddit.followersCount',

		'github_index': 'development.gitHub.index',
		'github_repos': 'development.gitHub.reposCount',
		'github_watchers': 'development.gitHub.watchersCount',
		'github_forks': 'development.gitHub.forksCount',
		'github_size': 'development.gitHub.size',

		'total_index': 'index'
	};

	let {sortBy, order} = req.query;
	let tempList = _.sortBy(listOfCoins, keys[sortBy] || 'market.coinMarketCap.marketVolumeUSD');
	order = order || 'desc';
	if (order == 'desc') {
		tempList = tempList.reverse();
	}

    res.render('index', {coins: tempList, sortBy: sortBy, order: order === 'asc' ? 'desc' : 'asc'});
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/:name', (req, res) => {
	let coin = listOfCoins.find(item => item.id === req.params.name);
	if (!coin) {
		return res.status(404);
	}
	res.render('singleCoin', coin);
});


app.listen(port, (err) => {
    if (err) {
        console.log('Something bad happened' + err)
        return next(err)
    }
    console.log('Server is listening on ' + port)
});

function update(){
	listOfCoins = JSON.parse(fs.readFileSync(LIST_OF_COINS, 'utf8'));
	setTimeout(update, INTERVAL);
}
update();