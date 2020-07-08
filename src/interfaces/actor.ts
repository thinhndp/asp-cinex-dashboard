export interface Actor {
  id: string,
  name: string,
  avatar: string,
}

export interface ActorInput {
  name: string,
  avatar: string,
}

export interface ActorValidation {
	name: string,
	avatar: string,
}
