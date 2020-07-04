import { Room } from "./room";
import { Movie } from "./movie";
import { ScreenType } from "./screenType";

export interface Showtime {
  id: string,
  room: Room,
  movie: Movie,
  screenType: ScreenType,
  price: number,
  status: string,
  startAt: string,
  endAt: string,
}

export interface ShowtimeInput {
  movieId: string,
  price: number,
  roomId: string,
  screenTypeId: string,
  startAt: string,
}