import { tmdbService } from "../../src/common/utils/services/tmdbService";
import { TMDBResult } from "../../src/types/generalTypes";

describe("Running TMDB service test...", () => {
  it("Running test for single movie retrieval..", async() => {
    expect(await tmdbService.getData("/100")).toBeDefined();
  });

  it("Running test for movie list retrieval..",async () => {
    expect(await tmdbService.getData("/popular")).toBeDefined();
  });

   it("Running test that changes baseUrl..", async() => {
     expect(await tmdbService.getData("https://api.themoviedb.org/3/search/movie?query=twilight&page=1")).toBeDefined();
     expect(await tmdbService.getData("/top_rated")).toBeDefined();
   });
});
