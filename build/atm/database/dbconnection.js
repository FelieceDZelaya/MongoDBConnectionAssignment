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
const mongodb_1 = require("mongodb");
class DbConnection {
    constructor() {
        this._userName = "fzelaya";
        this._passWord = "FZelaya12345";
        this._dbName = "bbl_atm";
        this._hostName = "ds117749.mlab.com";
        this._portNumber = "17749";
        this._dbAutoReconnectOption = { auto_reconnect: true };
    }
    connectDb() {
        return __awaiter(this, void 0, void 0, function* () {
            let dbURI = `mongodb://${this._userName}:${this._passWord}@${this._hostName}:${this._portNumber}/${this._dbName}`;
            console.log("URL interpolated ", dbURI);
            let resp = yield mongodb_1.MongoClient.connect(dbURI, this._dbAutoReconnectOption);
            this._db = resp.db(this._dbName);
            this._connection = resp;
            return this._db;
        });
    }
    findOne(doc, query) {
        return new Promise((resolve, reject) => {
            this._db.collection(doc).findOne(query).then((resp) => {
                if (resp != null) {
                    resolve(resp);
                }
                else {
                    reject('Account not found.');
                }
            }, (err) => { reject('Account error'); });
        });
    }
    find(doc, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db.collection(doc).find(query).toArray();
        });
    }
    updateOne(doc, query, argValue) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db.collection(doc).updateOne(query, { $set: argValue });
        });
    }
    deleteOne(doc, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db.collection(doc).updateOne(query);
        });
    }
    insertOne(doc, record) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db.collection(doc).insertOne(record);
        });
    }
    close() {
        this._connection.close();
    }
    getDb() {
        return this._db;
    }
}
exports.DbConnection = DbConnection;
