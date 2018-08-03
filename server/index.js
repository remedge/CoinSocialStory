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
    axios.get(API_COIN_URL+req.params.slug)
	.then(response => {
        res.render('singleCoin', response.data);
	});
});


app.listen(port, (err) => {
    if (err) {
        console.log('Something bad happened' + err);
        return next(err)
    }
    console.log('Server is listening on ' + port);
});