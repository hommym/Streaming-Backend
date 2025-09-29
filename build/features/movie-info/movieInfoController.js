"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieInfoController = void 0;
const controller_1 = require("../../common/utils/class/controller");
const movieInfoService_1 = require("./movieInfoService");
class MovieInfoController {
    addEndPoints() {
        this.contoller.addRoute("get", "/category/:cat", movieInfoService_1.movieinfoService.getMovieList);
        this.contoller.addRoute("get", "/search", movieInfoService_1.movieinfoService.search);
    }
    constructor() {
        this.contoller = new controller_1.Controller();
        this.addEndPoints();
    }
    get Router() {
        return this.contoller.Router;
    }
}
exports.movieInfoController = new MovieInfoController();
