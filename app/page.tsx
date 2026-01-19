'use client';

import { useEffect, useState } from 'react';
import { transactionAPI, Transaction } from '@/lib/api';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionAPI.getAll();
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar transações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📊 Dashboard - Versa</h1>
      <p>Gerenciador de Débitos e Transações com Firebase</p>
      
      {loading && <p>⏳ Carregando transações...</p>}
      {error && <p style={{ color: 'red', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>❌ Erro: {error}</p>}
      
      {!loading && !error && (
        <div>
          <h2>Transações ({transactions.length})</h2>
          {transactions.length === 0 ? (
            <p style={{ color: '#666' }}>Nenhuma transação encontrada. Comece adicionando uma!</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>ID</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Descrição</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Valor</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Categoria</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Tipo</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="tx-table-row">
                      <td style={{ fontSize: '12px', color: '#666' }}>
                        {tx.id?.substring(0, 8)}...
                      </td>
                      <td>{tx.description}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        R$ {typeof tx.amount === 'number' ? tx.amount.toFixed(2) : '0.00'}
                      </td>
                      <td>{tx.category}</td>
                      <td>
                        <span className={tx.type === 'income' ? 'status-income' : 'status-expense'}>
                          {tx.type === 'income' ? '📈 Entrada' : '📉 Saída'}
                        </span>
                      </td>
                      <td>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
