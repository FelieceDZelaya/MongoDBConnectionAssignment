"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class accountModel {
    constructor() {
        this.accountNumber = '';
        this.currentBalance = 0;
        this.accountPin = '';
        this.accountName = '';
    }
}
exports.accountModel = accountModel;
class accountList {
    constructor() {
        this.accounts = [];
    }
}
exports.accountList = accountList;
class TransactionModel {
    constructor() {
        this.accountNumber = '';
        this.dateOfTransaction = new Date();
        this.transactionType = '';
        this.amount = 0;
    }
}
exports.TransactionModel = TransactionModel;
class TransactionList {
    constructor() {
        this.transactions = [];
    }
}
exports.TransactionList = TransactionList;
