import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ExchangeDashboard = () => {
  const [historicalData] = useState(() => {
    const data = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 5);
    
    for (let i = 0; i <= 120; i++) {
      const date = new Date(startDate);
      date.setHours(date.getHours() + i);
      
      const basePrice = 82000;
      const volatility = 2000;
      const spotPrice = basePrice + (Math.random() - 0.5) * volatility;
      const futuresPremium = 200 + (Math.random() - 0.3) * 300;
      const futuresPrice = spotPrice + futuresPremium;
      
      data.push({
        time: date.toISOString(),
        displayTime: `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`,
        spotPrice,
        futuresPrice
      });
    }
    
    return data;
  });
  
  const bitcoinChartData = {
    labels: historicalData.map(data => data.displayTime),
    datasets: [
      {
        label: 'Bitcoin Spot Price',
        data: historicalData.map(data => data.spotPrice),
        borderColor: 'blue',
        fill: false,
      }
    ]
  };

  const basisChartData = {
    labels: historicalData.map(data => data.displayTime),
    datasets: [
      {
        label: 'Bitcoin Spot Price',
        data: historicalData.map(data => data.spotPrice),
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Bitcoin Futures Price',
        data: historicalData.map(data => data.futuresPrice),
        borderColor: 'red',
        fill: false,
      }
    ]
  };
  
  const marketData = [
    { exchange: 'Binance', connected: true },
    { exchange: 'Coinbase', connected: false },
    { exchange: 'Kraken', connected: true },
    { exchange: 'Bitfinex', connected: false },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">The Basis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-2">Bitcoin Price (5 Days)</h2>
          <Line data={bitcoinChartData} />
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-2">Bitcoin Spot vs Futures (5 Days)</h2>
          <Line data={basisChartData} />
        </div>
      </div>
      
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-2">Market Status</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border border-gray-300">
              <th className="p-2 border border-gray-300 text-left">Exchange</th>
              <th className="p-2 border border-gray-300 text-center">Connected</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((market, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="p-2 border border-gray-300">{market.exchange}</td>
                <td className="p-2 border border-gray-300 text-center">
                  <span className={`inline-block w-4 h-4 rounded-full ${market.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExchangeDashboard;
