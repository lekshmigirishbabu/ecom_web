export interface Product {
    id?: string;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
    description?: string;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface InventoryUpdate {
    productId: string;
    stock: number;
  }