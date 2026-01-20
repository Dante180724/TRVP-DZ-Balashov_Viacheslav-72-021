export interface Courier {
  id: string;
  fullName: string;
  workDistrict: string;
  maxCells: number;
  tasks?: DeliveryTask[];
}

export interface DeliveryTask {
  id: string;
  orderDescription: string;
  cellsOccupied: number;
  deliveryDistrict: string;
  deliveryAddress: string;
  courierId: string;
  courier?: Courier;
}
