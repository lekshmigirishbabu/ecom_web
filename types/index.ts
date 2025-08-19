export interface User {
    uid: string;
    email: string;
    role: 'admin' | 'customer';
    displayName?: string;
    createdAt: Date;
  }
  
  export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Order {
    id: string;
    customerId: string;
    customerEmail: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: Address;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface OrderItem {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
  }
  
  export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  export interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    link?: string;
    isActive: boolean;
    position: 'hero' | 'sidebar' | 'footer';
  }
  
  export interface Settings {
    tax: {
      rate: number;
      enabled: boolean;
    };
    shipping: {
      freeShippingThreshold: number;
      standardRate: number;
      expressRate: number;
    };
  }
  