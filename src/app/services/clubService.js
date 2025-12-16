import api from "./api";

const CLUB_BASE = "/clubs";  // ❗ /api yazmıyoruz, api.js zaten ekliyor

const clubService = {

    // TOTAL
    totalClubs: () => api.get(`${CLUB_BASE}/total`),

    // TOP BY MEMBERS
    getTopClubsByMembers: () => api.get(`${CLUB_BASE}/stats/top-by-members`),

    // GET BY ID
    getClubById: (id) => api.get(`${CLUB_BASE}/${id}`),

    // PAGED GET ALL
    getAllPaged: (params) => api.get(CLUB_BASE, { params }),

    // CREATE
    createClub: (data) => api.post(CLUB_BASE, data),

    // UPDATE
    updateClub: (id, data) => api.put(`${CLUB_BASE}/${id}`, data),

    // DELETE
    deleteClub: (id) => api.delete(`${CLUB_BASE}/${id}`),

    // ASSIGN PRESIDENT
    assignPresident: (clubId, userId) =>
        api.patch(`${CLUB_BASE}/${clubId}/assign-president/${userId}`),

    // ACTIVE CLUBS
    getActiveClubs: () => api.get(`${CLUB_BASE}/active`),

    // ACTIVE PAGED
    getActiveClubsPaged: (params) =>
        api.get(`${CLUB_BASE}/active/paged`, { params }),

    // DEACTIVATE
    deactivateClub: (id) => api.patch(`${CLUB_BASE}/${id}/deactivate`),

    // ACTIVATE
    activateClub: (id) => api.patch(`${CLUB_BASE}/${id}/activate`),
    // SEARCH CLUBS BY NAME
searchClubs: (name, page = 0, size = 20) =>
    api.get(`/clubs/search`, {
        params: {
            name: name ?? "",
            page,
            size
        }
    }),




    
};

export default clubService;
