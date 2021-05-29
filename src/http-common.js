import axios from "axios";

const port = process.env.PORT || 8000;

export default axios.create({
  baseURL: `http://localhost:${port}/api`,
  headers: {
    "Content-type": "application/json",
  },
});
