import api from "./api";

const EVENT_BASE = "/event";  // ❗ /api yazmıyoruz çünkü api.js zaten /api ekliyor

const eventService = {
  // CREATE EVENT
  createEvent: (data) => api.post(`${EVENT_BASE}/create`, data),

  // LIST ALL EVENTS
  getAllEvents: () => api.get(`${EVENT_BASE}/list`),

  // GET BY ID
  getEventById: (id) => api.get(`${EVENT_BASE}/get/${id}`),

  // SEARCH EVENTS
  searchEvents: (filter) =>
    api.get(`${EVENT_BASE}/filter`, { params: { filter } }),

  // JOIN EVENT
  joinEvent: (eventId) => api.post(`${EVENT_BASE}/${eventId}/join`),

  // LEAVE EVENT  (syntax fix ✔)
  leaveEvent: (eventId) => api.post(`${EVENT_BASE}/${eventId}/leave`),

  // UPDATE EVENT
  updateEvent: (eventId, data) =>
    api.put(`${EVENT_BASE}/update/${eventId}`, data),

  // DELETE EVENT
  deleteEvent: (eventId) =>
    api.delete(`${EVENT_BASE}/delete/${eventId}`),

  // TOTAL EVENTS
  totalEvents: () => api.get(`${EVENT_BASE}/total`),

  // PAGED UPCOMING EVENTS
  getUpcomingEventsPaged: (params) =>
    api.get(`${EVENT_BASE}/upcoming/paged`, { params }),

  // STATS → En Aktif Kulüpler (Son 3 Ay)
  getTopActiveClubsLast3Months: () =>
    api.get(`${EVENT_BASE}/stats/top-active-clubs`),

  // STATS → Bu Ayın En Popüler Etkinlikleri
  getTopEventsThisMonth: () =>
    api.get(`${EVENT_BASE}/top/month`)
};

export default eventService;
