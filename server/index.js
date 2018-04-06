'use strict'

const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const tools = require('./tools');
const numeral = require('numeral');
const objectPath = require("object-path");
const _ = require('lodash');
const bodyParser = require('body-parser');

const LIST_OF_COINS = path.join(__dirname, 'data', 'listOfCoins.json');
const VIEWS_DIR = path.join(__dirname, '..', 'views');

const INTERVAL = 600000;
// const INTERVAL = 10000;


console.log("yo!");

let listOfCoins = JSON.parse(fs.readFileSync(LIST_OF_COINS, 'utf8'));




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
		'market_volume': 'market.coinMarketCap.marketVolumeUSD',
		'social': 'social.index',
		'twitter_followers': 'social.twitter.followersCount',
		'twitter_statuses': 'social.twitter.statusesCount',
		'reddit_followers': 'social.reddit.followersCount'
	};

	let {sortBy, order} = req.query;
	let tempList = _.sortBy(listOfCoins, keys[sortBy] || 'social.index');
	order = order || 'desc';
	if (order == 'desc') {
		tempList = tempList.reverse();
	}

    res.render('index', {coins: tempList, sortBy: sortBy, order: order === 'asc' ? 'desc' : 'asc'});
});

listOfCoins.forEach(function(coin, i) {
  app.get('/' + coin.id, (req, res) => {
  	res.render('singleCoin', coin)
  });
});
app.get('/about', (req, res) => {
	res.render('about')
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