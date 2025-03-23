import { useEffect, useState } from "react";

const useWebSocket = (url: string) => {
  const [data, setData] = useState<any>(null);
  let socket: WebSocket;

  useEffect(() => {
    socket = new WebSocket(url);

    socket.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => socket.close();
  }, [url]);

  return data;
};

export default useWebSocket;
