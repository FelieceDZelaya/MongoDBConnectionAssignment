"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const atm_model_1 = require("./atm.model");
const dbconnection_1 = require("./database/dbconnection");
class Atm {
    constructor() {
        this._db = new dbconnection_1.DbConnection();
        this._accountDocs = "accounts";
        this._transactionDocs = "transactions";
        /*
        *  Initialize the local DB
        */
        this._db.connectDb().then(resp => {
            console.log("sucessfully connected!");
        });
        this.transactionList = new atm_model_1.TransactionList();
    }
    findAccountPin(acct, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = { "accountNumber": acct, "accountPin": pin };
            console.log("Querying Mongo Remote ", query);
            return yield this._db.findOne(this._accountDocs, query);
        });
    }
    accountExists(acct) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db.findOne(this._accountDocs, { "accountNumber": acct });
        });
    }
    accountExistLongVersion(acct) {
        var query = { 'accountNumber': acct };
        return new Promise((resolve, reject) => {
            this._db.findOne(this._accountDocs, query).then(resp => {
                if (resp != null) {
                    resolve(resp);
                }
                else {
                    reject("Account not found ");
                }
            }, err => { reject("Account not found "); });
        });
    }
    getCurrentBalance(acct) {
        var query = { 'accountNumber': acct };
        return new Promise((resolve, reject) => {
            this.accountExists(acct).then(resp => {
                if (resp != null) {
                    resolve(resp);
                }
                else {
                    reject("Account not found ");
                }
            }, err => { reject("Account not found "); });
        });
    }
    withDraw(acct, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let resp = yield this.accountExists(acct);
            if (resp != null) {
                let query = { 'accountNumber': acct };
                resp.currentBalance -= amount;
                let updatedValue = yield this._db.updateOne(this._accountDocs, query, resp);
                //record the transaction in the transaction list
                let newTransaction = new atm_model_1.TransactionModel();
                newTransaction.accountNumber = acct;
                newTransaction.amount = amount;
                newTransaction.transactionType = "WithDraw";
                //save the new transaction
                this._db.insertOne(this._transactionDocs, newTransaction).then(resp => {
                    console.log("Succesfully added a Transaction");
                }, err => {
                    console.log("There was an error trying to insert a Transaction");
                });
            }
            return resp;
        });
    }
    deposit(acct, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let resp = yield this.accountExists(acct);
            if (resp != null) {
                let query = { 'accountNumber': acct };
                resp.currentBalance += amount;
                let updatedValue = yield this._db.updateOne(this._accountDocs, query, resp);
                //record the transaction in the transaction list
                let newTransaction = new atm_model_1.TransactionModel();
                newTransaction.accountNumber = acct;
                newTransaction.amount = amount;
                newTransaction.transactionType = "Deposit";
                //save the new transaction
                this._db.insertOne(this._transactionDocs, newTransaction).then(resp => {
                    console.log("Succesfully added a Transaction");
                }, err => {
                    console.log("There was an error trying to insert a Transaction");
                });
            }
            return resp;
        });
    }
    getLastOperations(acct) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = { 'accountNumber': acct };
            return yield this._db.find(this._transactionDocs, query);
        });
    }
}
exports.Atm = Atm;
