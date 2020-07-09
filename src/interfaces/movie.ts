import { Genre } from "./genre";
import { ScreenType } from "./screenType";
import { Rate } from "./rate";

export interface Actor {
  name: string,
  avatar: string,
}

export interface Movie {
  id: string,
  title: string,
  storyline: string, //
  genres: Genre[],
  screenTypes: ScreenType[],
  directors: string[],
  actors: Actor[],
  country: string,
  releasedAt: string,
  endAt: string,
  runtime: number,
  poster: string,
  trailer: string, //
  wallpapers: string[], //
  rate: Rate,
}

export interface MovieInsertInput {
  imdb: string,
  // actors: Actor[],
  endAt: string,
  screenTypeIds: string[],
  rateId: number,
}

export interface MovieInsertValidation {
	imdb: string,
  screenTypes: string,
  rate: string,
}

export interface MovieUpdateInput {
  title: string,
  story: string, //
  actors: Actor[],
  releasedAt: string, //
  endAt: string,
  poster: string,
  trailer: string, //
  wallpapers: string[], //
  rateId: number,
  screenTypeIds: string[],
}

export interface MovieUpdateValidation {
	title: string,
	screenTypes: string,
  rate: string,
}
