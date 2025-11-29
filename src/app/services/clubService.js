import api from "./api";

const CLUB_BASE = "/api/clubs";

const clubService = {

    // -------------------- CREATE --------------------
    createClub: (data) => {
        return api.post(`${CLUB_BASE}`, data);
    },

    // -------------------- GET BY ID --------------------
    getClubById: (id) => {
        return api.get(`${CLUB_BASE}/${id}`);
    },

    // -------------------- GET ALL PAGED --------------------
    getAllPaged: (params) => {
        // params: { pageNumber, pageSize, columnName, asc }
        return api.get(CLUB_BASE, { params });
    },

    // -------------------- UPDATE --------------------
    updateClub: (id, data) => {
        return api.put(`${CLUB_BASE}/${id}`, data);
    },

    // -------------------- DELETE (SOFT) --------------------
    deleteClub: (id) => {
        return api.delete(`${CLUB_BASE}/${id}`);
    },

    // -------------------- ASSIGN PRESIDENT --------------------
    assignPresident: (clubId, userId) => {
        return api.patch(`${CLUB_BASE}/${clubId}/assign-president/${userId}`);
    },

    // -------------------- ACTIVE CLUBS --------------------
    getActiveClubs: () => {
        return api.get(`${CLUB_BASE}/active`);
    },

    // -------------------- ACTIVE CLUBS PAGED --------------------
    getActiveClubsPaged: (params) => {
        return api.get(`${CLUB_BASE}/active/paged`, { params });
    },

    // -------------------- DEACTIVATE CLUB --------------------
    deactivateClub: (id) => {
        return api.patch(`${CLUB_BASE}/${id}/deactivate`);
    },

    // -------------------- ACTIVATE CLUB --------------------
    activateClub: (id) => {
        return api.patch(`${CLUB_BASE}/${id}/activate`);
    },
    totalClubs: () => {
        return api.get(`${CLUB_BASE}/total`);
    },
    getTopClubsByMembers: () => {
        return api.get(`${CLUB_BASE}/stats/top-by-members`)
    },
};

export default clubService;
