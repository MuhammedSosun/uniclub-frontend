import api from "./api";

const CLUB_BASE = "/api/clubs";

export default {
    totalClubs: () => api.get(`${CLUB_BASE}/total`),
    getTopClubsByMembers: () => api.get(`${CLUB_BASE}/stats/top-by-members`),
    getClubById: (id) => api.get(`${CLUB_BASE}/${id}`),
    getAllPaged: (params) => api.get(CLUB_BASE, { params }),
    createClub: (data) => api.post(CLUB_BASE, data),
    updateClub: (id, data) => api.put(`${CLUB_BASE}/${id}`, data),
    deleteClub: (id) => api.delete(`${CLUB_BASE}/${id}`),
    assignPresident: (clubId, userId) =>
        api.patch(`${CLUB_BASE}/${clubId}/assign-president/${userId}`),

    getActiveClubs: () => api.get(`${CLUB_BASE}/active`),
    getActiveClubsPaged: (params) =>
        api.get(`${CLUB_BASE}/active/paged`, { params }),

    deactivateClub: (id) => api.patch(`${CLUB_BASE}/${id}/deactivate`),
    activateClub: (id) => api.patch(`${CLUB_BASE}/${id}/activate`)
};
