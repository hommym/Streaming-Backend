import { Controller } from "../../common/utils/class/controller";
import { MovieDetails, MovieOverviewList } from "../../types/generalTypes";
import { movieinfoService } from "./movieInfoService";

class MovieInfoController {
  private contoller = new Controller();

  private addEndPoints() {
    this.contoller.addRoute<MovieOverviewList>("get", "/category/:cat", movieinfoService.getMovieList);
    this.contoller.addRoute<MovieOverviewList>("get", "/search", movieinfoService.search);
    this.contoller.addRoute<MovieDetails>("get", "/detail", movieinfoService.getMovieDetails);
    this.contoller.addRoute<MovieOverviewList>("get", "/similar", movieinfoService.getSimilarMovies);
  }

  constructor() {
    this.addEndPoints();
  }

  public get Router() {
    return this.contoller.Router;
  }
}

export const movieInfoController = new MovieInfoController();
