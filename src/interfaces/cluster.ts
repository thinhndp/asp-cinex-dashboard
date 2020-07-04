export interface Cluster {
  id: string,
  name: string,
  address: string,
  hotline: string,
  manager: string,
}

export interface ClusterInput {
  manager: string,
  name: string,
  address: string,
  hotline: string,
}