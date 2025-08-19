"use client";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types/Product';
  
const PRODUCTS_COLLECTION = 'products';

export const productService = {
  // Create a new product
  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Convert imageUrl to imageURL to match Firebase structure
      const productData: Record<string, unknown> = {
        ...product,
        imageURL: product.imageUrl, // Convert to match Firebase field name
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      // Remove imageUrl since we're using imageURL
      delete productData.imageUrl;
      
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
      console.log('Product created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Get all products
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const products = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          price: data.price || 0,
          category: data.category || '',
          imageUrl: data.imageURL || data.imageUrl || '',
          description: data.description || '',
          stock: data.stock || 0,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Product;
      });

      // ✅ Log fetched products
      console.log("Fetched products:", products);

      return products;
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          price: data.price || 0,
          category: data.category || '',
          imageUrl: data.imageURL || data.imageUrl || '', // Handle both field names
          description: data.description || '',
          stock: data.stock || 0,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const updateData: Record<string, unknown> = {
        ...product,
        updatedAt: Timestamp.now()
      };
      
      // Convert imageUrl to imageURL if present
      if (product.imageUrl !== undefined) {
        updateData.imageURL = product.imageUrl;
        delete updateData.imageUrl;
      }
      
      // Remove undefined values and system fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || key === 'id' || key === 'createdAt') {
          delete updateData[key];
        }
      });
      
      await updateDoc(docRef, updateData as { [x: string]: any });
      console.log('Product updated:', id);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
      console.log('Product deleted:', id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Update stock levels (for CSV upload)
  async updateStock(productId: string, stock: number): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(docRef, {
        stock,
        updatedAt: Timestamp.now()
      });
      console.log('Stock updated for product:', productId);
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
};