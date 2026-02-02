import api from "./api";

const EVENT_BASE = "/event";

const eventService = {
  createEvent: (data) => api.post(`${EVENT_BASE}/create`, data),

  getEventById: (id) => api.get(`${EVENT_BASE}/get/${id}`),

  searchEvents: (filter = "") => api.get(`${EVENT_BASE}/filter`, { params: { filter } }),

  updateEvent: (eventId, data) => api.put(`${EVENT_BASE}/update/${eventId}`, data),

  deleteEvent: (eventId) => api.delete(`${EVENT_BASE}/delete/${eventId}`),
  joinEvent: (id) => api.post(`${EVENT_BASE}/${id}/join`),
  // Güncellenen Metod:
  getParticipants: (eventId, page = 0, size = 10, filter = "") =>
    api.get(`${EVENT_BASE}/${eventId}/participants?page=${page}&size=${size}&filter=${filter}`),
  changeStatus: (eventId, memberId, status) =>
    api.post(`${EVENT_BASE}/${eventId}/participation-status`, { memberId, status }),

  totalEvents: () => api.get(`${EVENT_BASE}/total`),

  // ✅ DOĞRU: POST + BODY
  getUpcomingEventsPaged: (body) => api.post(`${EVENT_BASE}/upcoming/paged`, body),

  getTopActiveClubsLast3Months: () => api.get(`${EVENT_BASE}/stats/top-active-clubs`),

  getTopEventsThisMonth: () => api.get(`${EVENT_BASE}/top/month`)
};

export default eventService;
