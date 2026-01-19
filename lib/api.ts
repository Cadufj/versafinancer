import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Query,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Transaction {
  id?: string;
  type: string;
  amount: number;
  category: string;
  source: string;
  description: string;
  date: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Debtor {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Transaction API
export const transactionAPI = {
  // Get all transactions
  getAll: async (filters?: Record<string, any>): Promise<Transaction[]> => {
    try {
      const transactionsRef = collection(db, 'transactions');
      let q: Query = transactionsRef;

      if (filters) {
        const constraints: QueryConstraint[] = [];
        if (filters.category) constraints.push(where('category', '==', filters.category));
        if (filters.type) constraints.push(where('type', '==', filters.type));
        if (filters.source) constraints.push(where('source', '==', filters.source));
        
        if (constraints.length > 0) {
          q = query(transactionsRef, ...constraints);
        }
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Transaction));
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  },

  // Get single transaction
  getById: async (id: string): Promise<Transaction | null> => {
    try {
      const docRef = doc(db, 'transactions', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        } as Transaction;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      throw error;
    }
  },

  // Create transaction
  create: async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
    try {
      const transactionsRef = collection(db, 'transactions');
      const docRef = await addDoc(transactionsRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return {
        id: docRef.id,
        ...data
      } as Transaction;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  },

  // Update transaction
  update: async (id: string, data: Partial<Transaction>): Promise<void> => {
    try {
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  },

  // Delete transaction
  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'transactions', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  }
};

// Debtor API
export const debtorAPI = {
  // Get all debtors
  getAll: async (filters?: Record<string, any>): Promise<Debtor[]> => {
    try {
      const debtorsRef = collection(db, 'debtors');
      let q: Query = debtorsRef;

      if (filters) {
        const constraints: QueryConstraint[] = [];
        if (filters.status) constraints.push(where('status', '==', filters.status));
        
        if (constraints.length > 0) {
          q = query(debtorsRef, ...constraints);
        }
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Debtor));
    } catch (error) {
      console.error('Erro ao buscar devedores:', error);
      throw error;
    }
  },

  // Get single debtor
  getById: async (id: string): Promise<Debtor | null> => {
    try {
      const docRef = doc(db, 'debtors', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        } as Debtor;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar devedor:', error);
      throw error;
    }
  },

  // Create debtor
  create: async (data: Omit<Debtor, 'id'>): Promise<Debtor> => {
    try {
      const debtorsRef = collection(db, 'debtors');
      const docRef = await addDoc(debtorsRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return {
        id: docRef.id,
        ...data
      } as Debtor;
    } catch (error) {
      console.error('Erro ao criar devedor:', error);
      throw error;
    }
  },

  // Update debtor
  update: async (id: string, data: Partial<Debtor>): Promise<void> => {
    try {
      const docRef = doc(db, 'debtors', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao atualizar devedor:', error);
      throw error;
    }
  },

  // Delete debtor
  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'debtors', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar devedor:', error);
      throw error;
    }
  }
};
