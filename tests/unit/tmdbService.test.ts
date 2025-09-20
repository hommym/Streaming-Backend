import { tmdbService } from "../../src/common/utils/services/tmdbService";
import { TMDBResult } from "../../src/types/generalTypes";

describe("Running TMDB service test...", () => {
  it("Running test for single movie retrieval..", () => {
    expect(tmdbService.getData("/100")).resolves;
  });

  it("Running test for movie list retrieval..",() => {
    expect(tmdbService.getData("/popular")).resolves;
  });
});
