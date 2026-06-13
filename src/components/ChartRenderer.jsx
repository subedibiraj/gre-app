import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import C from '../theme';

// Custom tooltip for premium look
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: `${C.cardHi}EE`, border: `1px solid ${C.border}`,
        padding: '10px 14px', borderRadius: 8, backdropFilter: 'blur(4px)',
        boxShadow: `0 8px 24px rgba(0,0,0,0.4)`
      }}>
        <p style={{ color: C.text, margin: '0 0 6px', fontWeight: 700, fontSize: 13 }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color || C.gold, margin: 0, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: entry.color || C.gold }} />
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartRenderer({ data, type = 'bar', height = 300 }) {
  if (!data || !data.data || !Array.isArray(data.data)) {
    return <div style={{ color: C.red, padding: 20 }}>Invalid chart data</div>;
  }

  const { title, xAxisKey, series, colors = [C.gold, C.blue, C.greenBr, C.red] } = data;

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey={xAxisKey || 'name'} stroke={C.textDim} fontSize={12} tickLine={false} axisLine={{ stroke: C.border }} />
              <YAxis stroke={C.textDim} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {series && series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: C.textMid }} />}
              {(series || [{ key: 'value', name: 'Value' }]).map((s, idx) => (
                <Bar key={s.key} dataKey={s.key} name={s.name} fill={colors[idx % colors.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey={xAxisKey || 'name'} stroke={C.textDim} fontSize={12} tickLine={false} axisLine={{ stroke: C.border }} />
              <YAxis stroke={C.textDim} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {series && series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: C.textMid }} />}
              {(series || [{ key: 'value', name: 'Value' }]).map((s, idx) => (
                <Line type="monotone" key={s.key} dataKey={s.key} name={s.name} stroke={colors[idx % colors.length]} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: C.bg }} activeDot={{ r: 6 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieDataKey = series ? series[0].key : 'value';
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data.data} cx="50%" cy="50%"
                innerRadius={height * 0.25} outerRadius={height * 0.4}
                paddingAngle={4} dataKey={pieDataKey} nameKey={xAxisKey || 'name'}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: C.textDim, strokeWidth: 1 }}
              >
                {data.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: '20px 24px', marginBottom: 20, position: 'relative' }}>
      {/* Glow behind */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '80%', height: '80%', background: colors[0] || C.gold, opacity: 0.05, filter: 'blur(50px)', pointerEvents: 'none', borderRadius: '50%' }} />
      
      {title && <h4 style={{ color: C.text, fontSize: 15, fontFamily: 'Georgia,serif', margin: '0 0 20px', textAlign: 'center' }}>{title}</h4>}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {renderChart()}
      </div>
    </div>
  );
}
