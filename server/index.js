'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const numeral = require('numeral');
const bodyParser = require('body-parser');
const axios = require('axios');
const url = require('url');

const VIEWS_DIR = path.join(__dirname, '..', 'views');

const API_COINS_LIST_URL = 'http://127.0.0.1:8000/api/coins';
const API_COIN_URL = 'http://127.0.0.1:8000/api/coins/';
const API_STATISTIC_URL = 'http://127.0.0.1:8000/api/coin_statistics?coin.slug=';

console.log("yo!");

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
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    let order = req.query.order;
    let sortBy = '';

    if (undefined === order) {
        order = [];
    }
    sortBy = Object.keys(order).pop();

    axios.get(API_COINS_LIST_URL, {params: query})
        .then(response => {
        	res.render('index', {coins: response.data, order: order, sortBy: sortBy});
        });
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/coin/:slug', (req, res) => {
    let promises = [];

    let coin = {};
    let priceData = [];
    let socialData = [];
    let developmentData = [];
    let networkData = [];

    promises.push(axios.get(API_COIN_URL+req.params.slug));
    promises.push(axios.get(API_STATISTIC_URL+req.params.slug));

    axios.all(promises)
        .then(axios.spread(function (coinResponse, statisticResponse) {
            coin = coinResponse.data;
            statisticResponse.data.forEach(function(statistic) {
                priceData.push({
                    t: statistic.timestamp,
                    y: statistic.priceIndex
                });
                socialData.push({
                    t: statistic.timestamp,
                    y: statistic.socialIndex
                });
                developmentData.push({
                    t: statistic.timestamp,
                    y: statistic.developmentIndex
                });
	            networkData.push({
		            t: statistic.timestamp,
		            y: statistic.networkIndex
	            });
            });

            res.render('singleCoin', {
                coin: coin,
                priceData: priceData,
                socialData: socialData,
                developmentData: developmentData,
                networkData: networkData
            });
        }));
});


app.listen(port, (err) => {
    if (err) {
        console.log('Something bad happened' + err);
        return next(err)
    }
    console.log('Server is listening on ' + port);
});