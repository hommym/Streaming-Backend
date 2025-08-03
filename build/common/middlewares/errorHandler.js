"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const multer_1 = require("multer");
const httpException_1 = require("../exceptions/http/httpException");
const errorHandler = async (err, req, res, next) => {
    if (err instanceof httpException_1.HttpException) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else if (err instanceof SyntaxError) {
        res.status(400).json({ error: err.message });
    }
    else if (err instanceof multer_1.MulterError) {
        res.status(400).json({ error: `${err.message} for uploaded file` });
    }
    else {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
    }
};
exports.errorHandler = errorHandler;
