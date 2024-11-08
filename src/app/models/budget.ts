export interface Budget {
  id?: string;
  client: string;
  date: Date;
  /* TODO
     Add collection to hold data about:
        - zone
        - moduleType reference that has information about (slots, price, type)
  */
  module: BudgetModule[];
}

export interface BudgetModule {
  moduleType: ModuleType;
  zone: Zone;
  price: number;
  slots: number;
}

export enum Zone {
  LIVING = 'Living',
  COMEDOR = 'Comedor',
  KITCHEN = 'Cocina',
  ROOM = 'Dormitorio'
}

export interface ModuleType {
  id: number;
  name: string;
  slots: number;
  price: number;
}
