import api from "./api";

const EVENT_BASE = "/api/event";

const eventService = {
  // CREATE
  createEvent: (data) => api.post(`${EVENT_BASE}/create`, data),

  // LIST
  getAllEvents: () => api.get(`${EVENT_BASE}/list`),

  // GET BY ID
  getEventById: (id) => api.get(`${EVENT_BASE}/get/${id}`),

  // SEARCH
  searchEvents: (filter) =>
    api.get(`${EVENT_BASE}/filter`, { params: { filter } }),

  // JOIN
  joinEvent: (eventId) => api.post(`${EVENT_BASE}/${eventId}/join`),

  // LEAVE
  leaveEvent: (eventId) => api.post(`${EVENT_BASE}/${eventId}/leave`),

  // UPDATE
  updateEvent: (eventId, data) =>
    api.put(`${EVENT_BASE}/update/${eventId}`, data),

  // DELETE
  deleteEvent: (eventId) =>
    api.delete(`${EVENT_BASE}/delete/${eventId}`),

  // TOTAL EVENTS
  totalEvents: () => api.get(`${EVENT_BASE}/total`),

  // PAGED UPCOMING EVENTS
  getUpcomingEventsPaged: (params) =>
    api.get(`${EVENT_BASE}/upcoming/paged`, { params }),

  // STATS → En Aktif Kulüpler (Son 3 ay)
  getTopActiveClubsLast3Months: () =>
    api.get(`${EVENT_BASE}/stats/top-active-clubs`),

  // 📅 Bu ayın en çok etkileşim alan etkinlikleri
  getTopEventsThisMonth: () =>
    api.get(`${EVENT_BASE}/top/month`)
};

export default eventService;
