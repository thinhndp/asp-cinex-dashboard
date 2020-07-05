import { Room } from "./room";
import { Movie } from "./movie";
import { ScreenType } from "./screenType";

export interface Showtime {
  id: string,
  room: Room,
  movie: Movie,
  screenType: ScreenType,
  basePrice: number,
  status: string,
  startAt: string,
  endAt: string,
}

export interface ShowtimeInput {
  movieId: string,
  basePrice: number,
  roomId: string,
  screenTypeId: string,
  startAt: string,
  status: string,
}

export interface ShowtimeValidation {
	movieId: string,
	basePrice: string,
	roomId: string,
	screenTypeId: string,
}
