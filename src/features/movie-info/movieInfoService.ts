import { Request } from "express";
import { redis } from "../../common/utils/services/redis";
import { tmdbService } from "../../common/utils/services/tmdbService";
import { serverEvents } from "../../events/serverEvents";
import { MovieDetails, MovieListCategory, MovieOverview, MovieOverviewList, TMDBMovie, TMDBResult } from "../../types/generalTypes";
import { BadReqException } from "../../common/exceptions/http/badReq";
import { UnauthReqException } from "../../common/exceptions/http/unauthReq";

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

  public getPageFromQueryParam(queryParam?: string) {
    let page = queryParam ? queryParam : "1";
    try {
      +page;
    } catch (error) {
      throw new BadReqException("Query parameter page must be a number");
    }
    return page;
  }

  public getMovieList = async (_dto: undefined, req: Request) => {
    const category = req.params.cat;
    let page = this.getPageFromQueryParam(req.query.page as string);

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

  public search = async (_dto: undefined, req: Request) => {
    let res: MovieOverviewList;
    const keyword = req.query.keyword;
    const page = this.getPageFromQueryParam(req.query.page as string);

    if (!keyword) new BadReqException("No value passed for query parameter keyword");
    const cachedData = await redis.getCachedData(`search:${keyword}:page:${page}`);

    if (cachedData) {
      res = JSON.parse(cachedData);
    } else {
      const tmdbRes = (await tmdbService.getData(`https://api.themoviedb.org/3/search/movie?page=${page}&query=${keyword}`)) as TMDBResult;
      res = this.tmdbApiResponseParser(tmdbRes);
      serverEvents.emit("cache-data", { key: `search:${keyword}:page:${page}`, value: JSON.stringify(res), exp: 86400 });
    }
    return res;
  };

  public getMovieDetails = async (_dto: undefined, req: Request) => {
    let movieId: string | number | undefined = req.query.movieId as string;
    if (!movieId) throw new BadReqException("No value passed for query param movieId");
    try {
      movieId = +movieId as number;
      if (!movieId) throw new Error();
    } catch (error) {
      throw new BadReqException("Query Parameter movieId must be a valid number");
    }

    let res: MovieDetails;
    const cachedData = await redis.getCachedData(`movieId:${movieId}`);

    if (cachedData) {
      res = JSON.parse(cachedData);
    } else {
      const tmdbRes = (await tmdbService.getData(`/${movieId}`)) as TMDBMovie;
      res = this.tmdbApiResponseParser(tmdbRes);
      serverEvents.emit("cache-data", { key: `movieId:${movieId}`, value: JSON.stringify(res), exp: 86400 });
    }
    return res;
  };

  public getSimilarMovies = async (_dto: undefined, req: Request) => {

     let movieId: string | number | undefined = req.query.movieId as string;
      let page = this.getPageFromQueryParam(req.query.page as string);
     if (!movieId) throw new BadReqException("No value passed for query param movieId");
     try {
       movieId = +movieId as number;
       if (!movieId) throw new Error();
     } catch (error) {
       throw new BadReqException("Query Parameter movieId must be a valid number");
     }

     let res: MovieOverviewList;
     const cachedData = await redis.getCachedData(`similar:${movieId}:page:${page}`);

     if (cachedData) {
       res = JSON.parse(cachedData);
     } else {
       const tmdbRes = (await tmdbService.getData(`/${movieId}/similar`)) as TMDBResult;
       res = this.tmdbApiResponseParser(tmdbRes);
       serverEvents.emit("cache-data", { key: `similar:${movieId}:page:${page}`, value: JSON.stringify(res), exp: 86400 });
     }
     return res;


  };
}

export const movieinfoService = new MovieInfoService();
