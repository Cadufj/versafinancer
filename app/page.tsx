'use client';

import { useEffect, useState } from 'react';
import { transactionAPI, Transaction } from '@/lib/api';
import TransactionForm from '@/Components/TransactionFormComponent';
import DashboardCharts from '@/Components/dashboard/DashboardCharts';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

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

  // Filtrar transações do mês selecionado
  const monthTransactions = transactions.filter(t => {
    try {
      const date = new Date(t.date);
      return date.getMonth() === selectedMonth;
    } catch {
      return false;
    }
  });

  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const monthNames2 = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div style={{ padding: '20px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>📊 Dashboard Financeiro</h1>
          <p>Controle completo da sua loja</p>
        </div>
        <div className="header-right">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              border: '1px solid #ecf0f1',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {monthNames2.map((name, idx) => (
              <option key={idx} value={idx}>{name} 2026</option>
            ))}
          </select>
          <button className="btn btn-secondary">📌 Fixado</button>
          <button className="btn btn-secondary">📥 Importar/Exportar</button>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            + Nova Transação
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fadbd8', 
          color: '#e74c3c', 
          padding: '12px 16px', 
          borderRadius: '6px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Resumo Cards */}
      <div className="summary-cards">
        <div className="card card-income">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-label">Entradas</div>
              <div className="card-value">R$ {totalIncome.toFixed(2)}</div>
              <div className="card-change">↑ 89.7% vs mês anterior</div>
            </div>
            <div className="card-icon">📈</div>
          </div>
        </div>

        <div className="card card-expense">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-label">Saídas</div>
              <div className="card-value">R$ {totalExpense.toFixed(2)}</div>
              <div className="card-change">↓ 68.9% vs mês anterior</div>
            </div>
            <div className="card-icon">📉</div>
          </div>
        </div>

        <div className="card card-balance">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-label">Saldo do Mês</div>
              <div className="card-value">R$ {balance.toFixed(2)}</div>
            </div>
            <div className="card-icon">💰</div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div style={{ marginBottom: '30px' }}>
          <TransactionForm onSuccess={() => {
            loadTransactions();
            setShowForm(false);
          }} />
        </div>
      )}

      {/* Gráficos */}
      {!loading && transactions.length > 0 && (
        <div className="charts-grid">
          <DashboardCharts transactions={transactions} />
        </div>
      )}

      {/* Tabela de Transações */}
      {loading && <p style={{ textAlign: 'center', padding: '40px' }}>⏳ Carregando...</p>}

      {!loading && (
        <div className="chart-container">
          <h2 style={{ marginBottom: '20px' }}>📋 Transações de {monthNames2[selectedMonth]}</h2>
          {monthTransactions.length === 0 ? (
            <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '30px' }}>
              Nenhuma transação encontrada. Comece adicionando uma!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f7fa', borderBottom: '2px solid #ecf0f1' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Descrição</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#2c3e50' }}>Valor</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Categoria</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Tipo</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {monthTransactions.map((tx) => (
                    <tr key={tx.id} className="tx-table-row">
                      <td style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        {tx.id?.substring(0, 8)}...
                      </td>
                      <td style={{ fontWeight: '500' }}>{tx.description}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: tx.type === 'income' ? '#27ae60' : '#e74c3c' }}>
                        R$ {typeof tx.amount === 'number' ? tx.amount.toFixed(2) : '0.00'}
                      </td>
                      <td>{tx.category}</td>
                      <td>
                        <span className={tx.type === 'income' ? 'status-income' : 'status-expense'}>
                          {tx.type === 'income' ? '📈 Entrada' : '📉 Saída'}
                        </span>
                      </td>
                      <td style={{ color: '#7f8c8d' }}>{tx.date}</td>
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
