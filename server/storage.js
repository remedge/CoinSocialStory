'use strict'

const path = require('path');
const fs = require('fs');
const request = require("superagent");
const Coin = require('./Coin');
const numeral = require('numeral');
const _ = require('lodash');

const COINS_PATH = path.join(__dirname, 'data', 'coins.json');
const LIST_PATH = path.join(__dirname, 'data', 'listOfCoins.json');
const LIST_PREV_PATH = path.join(__dirname, 'data', 'listOfCoinsPrev.json');
const LIST_HISTORY = path.join(__dirname, 'data', 'listOfHistory.json');
const LIST_HISTORY_24 = path.join(__dirname, 'data', 'listOfHistory24.json');
const DIR_HISTORY = path.join(__dirname, 'data', 'history');


module.exports = {
	saveData: function (data, dateNow) {
		const DATE_NOW_PATH = path.join(__dirname, 'data', 'history', dateNow + '.json');

		let listPrev;
		let list = _.cloneDeep(data);

		if (!fs.existsSync(DIR_HISTORY)) {
			fs.mkdirSync(DIR_HISTORY);
		}

		let history = JSON.parse(fs.readFileSync(LIST_HISTORY, 'utf8'));
		history.push(dateNow);
		fs.writeFileSync(LIST_HISTORY, JSON.stringify(history, null, 2));

		let history24 = JSON.parse(fs.readFileSync(LIST_HISTORY_24, 'utf8'));
		history24.sort();
		history24.push(dateNow);
		if( history24.length >= 24 ) {
			history24.shift();
		}

		const PREV_PATH = path.join(__dirname, 'data', 'history', history24[0] + '.json');

		fs.writeFileSync(DATE_NOW_PATH, JSON.stringify(list, null, 2));
		fs.writeFileSync(LIST_HISTORY_24, JSON.stringify(history24, null, 2));
		


		if (fs.existsSync(PREV_PATH)) {
			listPrev = JSON.parse(fs.readFileSync(PREV_PATH, 'utf8'))
			fs.writeFileSync(LIST_PREV_PATH, JSON.stringify(listPrev, null, 2));
		} else {
			fs.writeFileSync(LIST_PREV_PATH, JSON.stringify(list, null, 2));
		}

		fs.writeFileSync(LIST_PATH, JSON.stringify(list, null, 2));

	},
	loadData: function () {
		let list;
		let listPrev;

		if (fs.existsSync(LIST_PATH)) {
			list = JSON.parse(fs.readFileSync(LIST_PATH, 'utf8'));
		} else {
			let coins = JSON.parse(fs.readFileSync(COINS_PATH, 'utf8'));
			list = coins.map(item => new Coin(item));
		}

		if (fs.existsSync(LIST_PREV_PATH)) {
			listPrev = JSON.parse(fs.readFileSync(LIST_PREV_PATH, 'utf8'));
		} else {
			if (fs.existsSync(LIST_PATH)) {
				listPrev = JSON.parse(fs.readFileSync(LIST_PATH, 'utf8'));
			} else {
				let coins = JSON.parse(fs.readFileSync(COINS_PATH, 'utf8'));
				listPrev = coins.map(item => new Coin(item));
			}
		}

		return {list: list, listPrev: listPrev};
	}
}
