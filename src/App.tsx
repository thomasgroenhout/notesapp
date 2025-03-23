import React from "react";
import { Chart } from "react-chartjs-2";
import useWebSocket from "./hooks/useWebSocket";
import fetchData from "./hooks/useApi";

const App: React.FC = () => {
  const liveData = useWebSocket("wss://your-websocket-url");
  
  // Example: Fetch BTC prices from REST API
  React.useEffect(() => {
    fetchData("/btc-price").then((data) => console.log(data));
  }, []);

  return (
    <div>
      <h1>Crypto Dashboard</h1>
      <Chart type="line" data={{ /* chart data here */ }} />
    </div>
  );
};

export default App;