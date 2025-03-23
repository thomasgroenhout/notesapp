import { API } from "aws-amplify";

const fetchData = async (endpoint: string) => {
  try {
    return await API.get("myApiName", endpoint, {});
  } catch (error) {
    console.error("API Fetch Error:", error);
  }
};

export default fetchData;
