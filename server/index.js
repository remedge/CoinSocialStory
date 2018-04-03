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

const LIST_OF_COINS = path.join(__dirname, 'data', 'listOfCoins.json');
const VIEWS_DIR = path.join(__dirname, '..', 'views');


console.log("yo!")

let listOfCoins = JSON.parse(fs.readFileSync(LIST_OF_COINS, 'utf8'))


app.use(express.static('build'));
app.set('views', VIEWS_DIR)
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', {coins: listOfCoins});
})
app.get('/sortName/', (req, res) => {
	const sortListOfCoins = tools.sortByParam( _.cloneDeep(listOfCoins), 'name', 'string');
    res.render('index', {coins: sortListOfCoins});
})
app.get('/sortMarket/', (req, res) => {
	const sortListOfCoins = tools.sortByParam( _.cloneDeep(listOfCoins), 'market.coinMarketCap.marketVolumeUSD', 'number');
    res.render('index', {coins: sortListOfCoins});
})
app.get('/sortSocialIndex/', (req, res) => {
	const sortListOfCoins = tools.sortByParam( _.cloneDeep(listOfCoins), 'social.index', 'number');
    res.render('index', {coins: sortListOfCoins});
})
app.get('/sortTwitterFollowers/', (req, res) => {
	const sortListOfCoins = tools.sortByParam( _.cloneDeep(listOfCoins), 'social.twitter.followersCount', 'number');
    res.render('index', {coins: sortListOfCoins});
})
app.get('/sortTweetsAndReplies/', (req, res) => {
	const sortListOfCoins = tools.sortByParam( _.cloneDeep(listOfCoins), 'social.twitter.statusesCount', 'number');
    res.render('index', {coins: sortListOfCoins});
})
app.get('/sortSubredditFollowers/', (req, res) => {
	const sortListOfCoins = tools.sortByParam( _.cloneDeep(listOfCoins), 'social.reddit.followersCount', 'number');
    res.render('index', {coins: sortListOfCoins});
})
listOfCoins.forEach(function(coin, i) {
  app.get('/' + coin.id, (req, res) => {
  	res.render('singleCoin', coin)
  })
})
app.get('/about', (req, res) => {
	res.render('about')
})

app.listen(port, (err) => {
    if (err) {
        console.log('Something bad happened' + err)
        return next(err)
    }
    console.log('Server is listening on ' + port)
})