const axios = require("axios");
const apiKey = "a2644830525768abe1b80d4a856578c6";
const appId = "d3aebfb3";
const API_DOMAIN = "https://trackapi.nutritionix.com/v2";

const headers = {
  "x-app-id": appId,
  "x-app-key": apiKey,
  "x-remote-user-id": "0",
};

export const getSuggestions = async (reqString) => {
  const body = { query: reqString };
  let resp;
  await axios
    .post("/search/instant", body, { baseURL: API_DOMAIN, headers: headers })
    .then((response) => {
      resp = response.data;
    })
    .catch((error) => console.log("get error", error));
  return resp;
};
