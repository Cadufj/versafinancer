'use client';

import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { Transaction } from '@/lib/api';

interface DashboardChartsProps {
  transactions: Transaction[];
}

export default function DashboardCharts({ transactions }: DashboardChartsProps) {
  // Preparar dados para gráfico de fluxo mensal
  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string; Entradas: number; Saídas: number }> = {
      'jan': { month: 'jan', Entradas: 0, Saídas: 0 },
      'fev': { month: 'fev', Entradas: 0, Saídas: 0 },
      'mar': { month: 'mar', Entradas: 0, Saídas: 0 },
      'abr': { month: 'abr', Entradas: 0, Saídas: 0 },
      'mai': { month: 'mai', Entradas: 0, Saídas: 0 },
      'jun': { month: 'jun', Entradas: 0, Saídas: 0 },
      'jul': { month: 'jul', Entradas: 0, Saídas: 0 },
      'ago': { month: 'ago', Entradas: 0, Saídas: 0 },
      'set': { month: 'set', Entradas: 0, Saídas: 0 },
      'out': { month: 'out', Entradas: 0, Saídas: 0 },
      'nov': { month: 'nov', Entradas: 0, Saídas: 0 },
      'dez': { month: 'dez', Entradas: 0, Saídas: 0 },
    };

    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    transactions.forEach(tx => {
      try {
        const date = new Date(tx.date);
        const monthIndex = date.getMonth();
        const monthKey = monthNames[monthIndex];

        if (tx.type === 'income') {
          months[monthKey].Entradas += tx.amount || 0;
        } else {
          months[monthKey].Saídas += tx.amount || 0;
        }
      } catch (e) {
        console.error('Erro ao processar data:', tx.date);
      }
    });

    return monthNames.map(key => months[key]);
  }, [transactions]);

  // Preparar dados para gráfico de categorias
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(tx => {
        categories[tx.category] = (categories[tx.category] || 0) + (tx.amount || 0);
      });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  }, [transactions]);

  // Preparar dados para gráfico de fontes de receita
  const sourceData = useMemo(() => {
    const sources: Record<string, number> = {};

    transactions
      .filter(t => t.type === 'income')
      .forEach(tx => {
        sources[tx.source || 'Outros'] = (sources[tx.source || 'Outros'] || 0) + (tx.amount || 0);
      });

    return Object.entries(sources).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  }, [transactions]);

  const COLORS = ['#27ae60', '#e74c3c', '#f39c12', '#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

  return (
    <>
      {/* Fluxo de Caixa Mensal */}
      <div className="chart-container">
        <h3 className="chart-title">Fluxo de Caixa Mensal</h3>
        <p className="chart-subtitle">Comparativo de entradas e saídas ao longo do ano</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
            <XAxis dataKey="month" stroke="#7f8c8d" />
            <YAxis stroke="#7f8c8d" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ecf0f1' }}
              formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
            />
            <Legend />
            <Line type="monotone" dataKey="Entradas" stroke="#27ae60" strokeWidth={2} />
            <Line type="monotone" dataKey="Saídas" stroke="#e74c3c" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Onde está indo o dinheiro */}
      <div className="chart-container">
        <h3 className="chart-title">Onde está indo o dinheiro?</h3>
        <p className="chart-subtitle">Distribuição de gastos por categoria</p>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Sem dados de gastos</p>
        )}
      </div>

      {/* De onde vem o dinheiro */}
      <div className="chart-container">
        <h3 className="chart-title">De onde vem o dinheiro?</h3>
        <p className="chart-subtitle">Distribuição de receita por fonte</p>
        {sourceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Sem dados de receita</p>
        )}
      </div>
    </>
  );
}
