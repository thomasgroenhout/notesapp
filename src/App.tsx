import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';


const ExchangeDashboard = () => {
  // Sample historical data for the past 5 days
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

  // Sample data structure for current market data
  const [marketData, setMarketData] = useState({
    spot: [
      { exchange: 'Coinbase Pro', bid: 69842.50, ask: 69845.75, bidSize: 2.345, askSize: 1.892, connected: true },
      { exchange: 'Binance', bid: 69841.25, ask: 69844.00, bidSize: 4.212, askSize: 3.567, connected: true },
      { exchange: 'Kraken', bid: 69840.00, ask: 69846.50, bidSize: 1.876, askSize: 2.123, connected: false },
      { exchange: 'Gemini', bid: 69838.75, ask: 69847.25, bidSize: 0.987, askSize: 1.432, connected: true },
      { exchange: 'Bitstamp', bid: 69839.50, ask: 69848.00, bidSize: 1.543, askSize: 0.876, connected: false }
    ],
    perpFutures: [
      { exchange: 'Binance Futures', bid: 69852.50, ask: 69855.25, bidSize: 12.567, askSize: 10.234, connected: true },
      { exchange: 'Bybit', bid: 69851.75, ask: 69856.50, bidSize: 8.765, askSize: 7.654, connected: true },
      { exchange: 'OKX', bid: 69850.25, ask: 69857.00, bidSize: 15.432, askSize: 11.765, connected: false },
      { exchange: 'dYdX', bid: 69853.00, ask: 69858.50, bidSize: 5.678, askSize: 4.321, connected: true },
      { exchange: 'FTX', bid: 69851.00, ask: 69856.00, bidSize: 9.876, askSize: 8.765, connected: false }
    ],
    termFutures: [
      { exchange: 'CME', bid: 69872.50, ask: 69878.25, bidSize: 22.345, askSize: 18.765, connected: true },
      { exchange: 'Bakkt', bid: 69871.00, ask: 69879.50, bidSize: 12.543, askSize: 10.876, connected: false },
      { exchange: 'BitMEX', bid: 69870.25, ask: 69876.75, bidSize: 18.987, askSize: 15.432, connected: true },
      { exchange: 'Deribit', bid: 69873.50, ask: 69877.00, bidSize: 16.543, askSize: 14.321, connected: true },
      { exchange: 'Huobi Futures', bid: 69869.75, ask: 69875.25, bidSize: 14.765, askSize: 12.987, connected: false }
    ]
  });

  // Function to simulate live data updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setMarketData(prevData => {
        // Create a deep copy of the previous data
        const newData = JSON.parse(JSON.stringify(prevData));
        
        // Apply small random changes to simulate live updates
        Object.keys(newData).forEach(marketType => {
          newData[marketType].forEach(item => {
            // Random price fluctuation within a small range
            const bidChange = (Math.random() - 0.5) * 5;
            const askChange = (Math.random() - 0.5) * 5;
            const bidSizeChange = (Math.random() - 0.5) * 0.5;
            const askSizeChange = (Math.random() - 0.5) * 0.5;
            
            // Update prices
            let newBid = parseFloat((item.bid + bidChange).toFixed(2));
            let newAsk = parseFloat((item.ask + askChange).toFixed(2));
            
            // Ensure bid is always lower than ask (maintaining proper spread)
            if (newBid >= newAsk) {
              // Calculate a minimum spread of 0.25
              const minSpread = 0.25;
              // Set ask to be minimum spread above bid
              newAsk = newBid + minSpread;
            }
            
            item.bid = newBid;
            item.ask = newAsk;
            item.bidSize = parseFloat((item.bidSize + bidSizeChange).toFixed(3));
            item.askSize = parseFloat((item.askSize + askSizeChange).toFixed(3));
          });
        });
        
        return newData;
      });
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(updateInterval);
  }, []);

  const [timestamp, setTimestamp] = useState(new Date());
  
  // Update timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Calculate best bid and ask for a market type
  const calculateBestPrices = (data) => {
    let bestBid = -Infinity;
    let bestAsk = Infinity;
    let bestBidSize = 0;
    let bestAskSize = 0;
    let bestBidExchange = '';
    let bestAskExchange = '';
    
    data.forEach(item => {
      if (item.bid > bestBid) {
        bestBid = item.bid;
        bestBidSize = item.bidSize;
        bestBidExchange = item.exchange;
      }
      if (item.ask < bestAsk) {
        bestAsk = item.ask;
        bestAskSize = item.askSize;
        bestAskExchange = item.exchange;
      }
    });
    
    return {
      bestBid,
      bestAsk,
      bestBidSize,
      bestAskSize,
      bestBidExchange,
      bestAskExchange,
      spread: bestAsk - bestBid
    };
  };

  // Render a market table
  const renderMarketTable = (marketType, data) => {
    const bestPrices = calculateBestPrices(data);
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">{marketType}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Exchange</th>
                <th className="p-2 border text-right">Bid ($)</th>
                <th className="p-2 border text-right">Ask ($)</th>
                <th className="p-2 border text-right">Spread ($)</th>
                <th className="p-2 border text-right">Bid Size (BTC)</th>
                <th className="p-2 border text-right">Ask Size (BTC)</th>
                <th className="p-2 border text-center">Connected</th>
              </tr>
            </thead>
            <tbody>
              {/* Best row - highlighted */}
              <tr className="bg-blue-50 font-semibold border-t-2 border-b-2 border-blue-200">
                <td className="p-2 border font-medium">
                  BEST PRICE
                  <div className="text-xs font-normal text-gray-500">
                    Bid: {bestPrices.bestBidExchange} | Ask: {bestPrices.bestAskExchange}
                  </div>
                </td>
                <td className="p-2 border text-right text-green-600">
                  {bestPrices.bestBid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
                <td className="p-2 border text-right text-green-600">
                  {bestPrices.bestAsk.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
                <td className="p-2 border text-right text-green-600">
                  {bestPrices.spread.toFixed(2)}
                </td>
                <td className="p-2 border text-right">
                  {bestPrices.bestBidSize.toFixed(3)}
                </td>
                <td className="p-2 border text-right">
                  {bestPrices.bestAskSize.toFixed(3)}
                </td>
                <td className="p-2 border text-center">-</td>
              </tr>
              
              {/* Exchange rows */}
              {data.map((item, index) => {
                const spread = (item.ask - item.bid).toFixed(2);
                const isNarrowSpread = parseFloat(spread) <= 5;
                const isBestBid = item.bid === bestPrices.bestBid;
                const isBestAsk = item.ask === bestPrices.bestAsk;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border font-medium">{item.exchange}</td>
                    <td className={`p-2 border text-right ${isBestBid ? 'text-green-600 font-semibold' : ''}`}>
                      {item.bid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className={`p-2 border text-right ${isBestAsk ? 'text-green-600 font-semibold' : ''}`}>
                      {item.ask.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className={`p-2 border text-right ${isNarrowSpread ? 'text-green-600' : 'text-red-600'}`}>
                      {spread}
                    </td>
                    <td className="p-2 border text-right">{item.bidSize.toFixed(3)}</td>
                    <td className="p-2 border text-right">{item.askSize.toFixed(3)}</td>
                    <td className="p-2 border text-center">
                      {item.connected ? 
                        <span className="inline-block w-4 h-4 bg-green-500 rounded-full"></span> : 
                        <span className="inline-block w-4 h-4 bg-red-500 rounded-full"></span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Find best opportunity across all markets
  const findBestOpportunity = () => {
    const bestPricesSpot = calculateBestPrices(marketData.spot);
    const bestPricesPerpFutures = calculateBestPrices(marketData.perpFutures);
    const bestPricesTermFutures = calculateBestPrices(marketData.termFutures);
    
    // Find tightest spread
    const allSpreads = [
      { type: 'Spot', ...bestPricesSpot },
      { type: 'Perpetual Futures', ...bestPricesPerpFutures },
      { type: 'Term Futures', ...bestPricesTermFutures }
    ];
    
    const bestSpread = allSpreads.reduce((best, current) => 
      current.spread < best.spread ? current : best, 
      { spread: Infinity });
      
    return bestSpread;
  };

  const bestOpportunity = findBestOpportunity();
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

