import api from './api'

const MEMBER_SHIP_BASE = "/member-ship-clubs";


const membershipService = {

    requestJoin: (clubId) => api.post(
        `${MEMBER_SHIP_BASE}/${clubId}/join-requests`
    ),
    pendingRequests: (clubId) => api.get(
    `${MEMBER_SHIP_BASE}/${clubId}/join-requests`),
    approve: (clubId,memberId) => api.post(
        `${MEMBER_SHIP_BASE}/${clubId}/join-requests/${memberId}/approve`
    ),
    reject: (clubId, memberId) => api.post(`${MEMBER_SHIP_BASE}/${clubId}/join-requests/${memberId}/reject`)
}

export default membershipService;
