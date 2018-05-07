"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const atm_1 = require("./atm/atm");
class App {
    constructor() {
        this.OK_MESSAGE = { status: 0, message: "ok" };
        this.ACCOUNT_NOT_FOUND = { status: -100, message: "Not found" };
        this.webService = express();
        this.webService.use(cors());
        this.atm = new atm_1.Atm();
        this.mountAtmRoutes();
    }
    mountAtmRoutes() {
        const atmLive = express.Router();
        const atmFind = express.Router();
        const atmWithDraw = express.Router();
        const atmDeposit = express.Router();
        const atmBalance = express.Router();
        const atmTransactions = express.Router();
        atmLive.get('/atm', (req, resp) => {
            resp.json(this.OK_MESSAGE);
        });
        atmFind.get('/atm/find/:acct/pin/:pin', (req, resp) => {
            this.atm.findAccountPin(req.params.acct, req.params.pin).then(result => {
                resp.json(this.OK_MESSAGE);
            }, err => {
                resp.json(this.ACCOUNT_NOT_FOUND);
            });
        });
        atmBalance.get('/atm/:acct', (req, resp) => {
            console.log("Balance, Acct ", req.params.acct);
            this.atm.getCurrentBalance(req.params.acct).then(result => {
                resp.json({
                    status: 0,
                    accountNumber: req.params.acct,
                    accountName: result.accountName,
                    currentBalance: result.currentBalance
                });
            }, err => {
                resp.json(this.ACCOUNT_NOT_FOUND);
            });
        });
        atmDeposit.get('/atm/deposit/:acct/amount/:amount', (req, resp) => {
            console.log('Deposit of ', req.params.amount);
            this.atm.deposit(req.params.acct, parseFloat(req.params.amount)).then(result => {
                resp.json({
                    status: 0,
                    accountNumber: result.accountNumber,
                    currentBalance: result.currentBalance
                });
            }, err => { resp.json(this.ACCOUNT_NOT_FOUND); });
        });
        atmWithDraw.get('/atm/withdraw/:acct/amount/:amount', (req, resp) => {
            console.log('withdraw of ', req.params.amount);
            this.atm.withDraw(req.params.acct, parseFloat(req.params.amount)).then(result => {
                resp.json({
                    status: 0,
                    accountNumber: result.accountNumber,
                    currentBalance: result.currentBalance
                });
            }, err => { resp.json(this.ACCOUNT_NOT_FOUND); });
        });
        atmTransactions.get('/atm/transactions/:acct', (req, resp) => {
            console.log('Transaction List');
            this.atm.accountExists(req.params.acct).then(found => {
                this.atm.getLastOperations(req.params.acct).then(result => {
                    resp.json({
                        status: 0,
                        accountNumber: req.params.acct,
                        transactions: result
                    });
                }, err => { console.log("Error", err); });
            }, notFound => { resp.json(this.ACCOUNT_NOT_FOUND); });
        });
        //We have to make sure express knows about our routes
        this.webService.use(atmLive);
        this.webService.use(atmFind);
        this.webService.use(atmBalance);
        this.webService.use(atmTransactions);
        this.webService.use(atmDeposit);
        this.webService.use(atmWithDraw);
    }
}
exports.App = App;
exports.default = new App().webService;
