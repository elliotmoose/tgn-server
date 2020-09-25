"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Ids = {
    isValidId: function (value) {
        return mongoose_1.default.Types.ObjectId.isValid(value);
    },
    makeId: function () {
        return "" + mongoose_1.default.Types.ObjectId();
    }
};
exports.default = Ids;
