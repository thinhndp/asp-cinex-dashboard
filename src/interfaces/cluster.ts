export interface Cluster {
  id: string,
  name: string,
  address: string,
  manager: string,
}

export interface ClusterInput {
  manager: string,
  name: string,
  address: string,
}