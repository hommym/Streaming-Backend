import { Request } from "express";
import { redis } from "../../common/utils/services/redis";
import { tmdbService } from "../../common/utils/services/tmdbService";
import { serverEvents } from "../../events/serverEvents";
import { MovieDetails, MovieListCategory, MovieOverview, MovieOverviewList, TMDBMovie, TMDBResult } from "../../types/generalTypes";
import { BadReqException } from "../../common/exceptions/http/badReq";

class MovieInfoService {
  public tmdbApiResponseParser(response: TMDBResult): MovieOverviewList;
  public tmdbApiResponseParser(response: TMDBMovie): MovieDetails;

  public tmdbApiResponseParser(response: TMDBResult | TMDBMovie): MovieOverviewList | MovieDetails {
    let parsedData: MovieOverviewList | MovieDetails;

    if ("results" in response) {
      const movies: MovieOverview[] = [];

      parsedData = { page: response.page, totalPages: response.total_pages, totalNo: response.total_results, movies };

      response.results.forEach((item) => {
        movies.push({
          id: item.id,
          posterUrl: `https://image.tmdb.org/t/p/original${item.poster_path}`,
          rating: item.vote_average,
          releaseYear: item.release_date.split("-")[0],
          title: item.original_title,
        });
      });
    } else {
      const genres: string[] = [];
      parsedData = {
        genres,
        id: response.id,
        title: response.title,
        description: response.overview,
        streamUrl: undefined,
        releaseYear: response.release_date.split("-")[0],
        rating: response.vote_average,
        duration: response.runtime!,
        posterUrl: `https://image.tmdb.org/t/p/original${response.poster_path}`,
        backdropUrl: `https://image.tmdb.org/t/p/original${response.backdrop_path}`,
      };

      response.genres!.forEach((genre) => genres.push(genre.name));
    }

    return parsedData;
  }

  public getMovieList = async (_dto: undefined, req: Request) => {
    const category = req.params.cat;
    let page: string | number = req.query.page ? (req.query.page as string) : "1";

    try {
      +page;
    } catch (error) {
      throw new BadReqException("Query parameter page must be a number");
    }

    if (!["top_rated", "now_playing", "popular", "upcoming"].includes(category)) throw new BadReqException("Url parameter cat must be one of these values [top_rated,now_playing,popular,upcoming]");

    const cachedData = await redis.getCachedData(`category:${category}:page:${page}`);
    let res: MovieOverviewList;
    if (cachedData) {
      res = JSON.parse(cachedData);
    } else {
      const tmdbRes = (await tmdbService.getData(`/${category}?page=${page}`)) as TMDBResult;
      res = this.tmdbApiResponseParser(tmdbRes);
      serverEvents.emit("cache-data", { key: `category:${category}:page:${page}`, value: JSON.stringify(res), exp: 86400 });
    }

    return res;
  };
}

export const movieinfoService = new MovieInfoService();
