import { ScreenType } from "./screenType";

export interface Room {
  id: string,
  name: string,
  // cluster: 
  screenTypes: ScreenType[],
  totalSeats: number,
  totalSeatsPerRow: number,
  totalRows: number,
}

export interface RoomInput {
  name: string,
  clusterId: string,
  screenTypeIds: string[],
  totalRows: number,
  totalSeatsPerRow: number,
}

export interface RoomValidation {
	name: string,
	screenTypes: string,
	totalRows: string,
	totalSeatsPerRow: string,
}
