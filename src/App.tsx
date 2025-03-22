import React, { useState, useEffect } from 'react';

const ExchangeDashboard = () => {
  // Sample historical data for the past 5 days
  const [historicalData] = useState(() => {
    const data = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 5);
    
    // Generate data points for each hour over the past 5 days
    for (let i = 0; i <= 120; i++) {
      const date = new Date(startDate);
      date.setHours(date.getHours() + i);
      
      // Base price around $70,000 with some randomness
      const basePrice = 82000 ;
      const volatility = 2000; // Max price movement
      const spotPrice = basePrice + (Math.random() - 0.5) * volatility;
      
      // Futures generally trade at a premium to spot
      const futuresPremium = 200 + (Math.random() - 0.3) * 300;
      const futuresPrice = spotPrice + futuresPremium;
      
      data.push({
        time: date.toISOString(),
        displayTime: `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`,
        spotPrice: spotPrice,
        futuresPrice: futuresPrice,
        basis: futuresPremium
      });
    }
    
    return data;
  });

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">The Basis</h1>
        <div className="text-gray-600">
          Last Updated: {timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">Best Trading Opportunity</h3>
        <p><span className="font-medium">Market:</span> {bestOpportunity.type}</p>
        <p><span className="font-medium">Spread:</span> <span className="text-green-600">${bestOpportunity.spread.toFixed(2)}</span></p>
        <p><span className="font-medium">Bid:</span> ${bestOpportunity.bestBid.toFixed(2)} ({bestOpportunity.bestBidExchange})</p>
        <p><span className="font-medium">Ask:</span> ${bestOpportunity.bestAsk.toFixed(2)} ({bestOpportunity.bestAskExchange})</p>
      </div>
      
      {renderMarketTable('Bitcoin Spot Markets', marketData.spot)}
      {renderMarketTable('Bitcoin Perpetual Futures', marketData.perpFutures)}
      {renderMarketTable('Bitcoin Term Futures', marketData.termFutures)}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Data updates every 3 seconds. All prices in USD.</p>
        <p>This is simulated data for prototype purposes. Connect to exchange APIs for live data.</p>
      </div>
    </div>
  );
};

export default ExchangeDashboard;