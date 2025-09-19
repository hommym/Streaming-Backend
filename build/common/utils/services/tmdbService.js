"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmdbService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const serverError_1 = require("../../exceptions/http/serverError");
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
class TMDBService {
    constructor() {
        this.baseUrl = "https://api.themoviedb.org/3/movie";
        this.authToken = process.env.TMDB_API_KEY;
        if (!this.authToken)
            throw new serverError_1.ServerErrException("No TMDB_API_KEY found in env");
        this.axiosInstance = axios_1.default.create({ baseURL: this.baseUrl, headers: { Authorization: `Bearer ${this.authToken}` } });
    }
    async getData(path) {
        const response = await this.axiosInstance.get(path);
        if (response.status != 200)
            throw new serverError_1.ServerErrException("TMDB API Request Error");
        return response.data;
    }
}
exports.tmdbService = new TMDBService();
