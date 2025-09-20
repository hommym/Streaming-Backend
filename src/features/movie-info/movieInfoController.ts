import { Controller } from "../../common/utils/class/controller";
import { MovieOverviewList } from "../../types/generalTypes";
import { movieinfoService } from "./movieInfoService";

class MovieInfoController {
  private contoller = new Controller();

  private addEndPoints() {
    this.contoller.addRoute<MovieOverviewList>("get", "/category/:cat", movieinfoService.getMovieList);
  }

  constructor() {
    this.addEndPoints();
  }

  public get Router() {
    return this.contoller.Router;
  }
}

export const movieInfoController = new MovieInfoController();
