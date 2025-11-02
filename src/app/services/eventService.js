import axios from "axios";

export const getAllEvents = async (filter = "") => {
  const url = filter
    ? `http://localhost:8080/api/event/filter?filter=${filter}`
    : `http://localhost:8080/api/event/list`;

  const res = await axios.get(url);
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await axios.post(
    "http://localhost:8080/api/event/create",
    eventData
  );
  return res.data;
};