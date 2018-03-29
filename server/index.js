'use strict'

const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const constructor = require('./constructor');
const path = require('path');

const LIST_OF_COINS = path.join(__dirname, 'data', 'listOfCoins.json');
const VIEWS_DIR = path.join(__dirname, '..', 'views');

// const ngrok = require('ngrok');
// const url = await ngrok.connect();


console.log("yo!")

console.log(typeof constructor.coin); // => 'function'

let listOfCoins = JSON.parse(fs.readFileSync(LIST_OF_COINS, 'utf8'))
console.log(listOfCoins[2].market.coinMarketCap)

app.use(express.static('build'));
app.set('views', VIEWS_DIR)
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', {coins: listOfCoins});
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
        console.log('something bad happened' + err)
        return next(err)
    }
    console.log('server is listening on ' + port)
})