import dotenv from "dotenv";
import { ServerErrException } from "../../exceptions/http/serverError";
import axios, { Axios } from "axios";
import { TMDBMovie, TMDBResult } from "../../../types/generalTypes";
dotenv.config();

class TMDBService {
  private baseUrl = "https://api.themoviedb.org/3/movie";
  private authToken = process.env.TMDB_API_KEY;
  private axiosInstance: Axios;

  constructor() {
    if (!this.authToken) throw new ServerErrException("No TMDB_API_KEY found in env");
    this.axiosInstance = axios.create({ baseURL: this.baseUrl, headers: { Authorization: `Bearer ${this.authToken}` } });
  }

  public async getData(path: string): Promise<TMDBMovie | TMDBResult> {
    const response = await this.axiosInstance.get(path);
    if (response.status != 200) throw new ServerErrException("TMDB API Request Error");
    return response.data;
  }
}

export const tmdbService = new TMDBService();
