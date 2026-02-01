import api from "./api";

const MEMBER_SHIP_BASE = "/member-ship-clubs";

const membershipService = {
  requestJoin: (clubId) => api.post(`${MEMBER_SHIP_BASE}/${clubId}/join-requests`),
  pendingRequests: (clubId) => api.get(`${MEMBER_SHIP_BASE}/${clubId}/join-requests`),
  approve: (clubId, memberId) =>
    api.post(`${MEMBER_SHIP_BASE}/${clubId}/join-requests/${memberId}/approve`),
  reject: (clubId, memberId) =>
    api.post(`${MEMBER_SHIP_BASE}/${clubId}/join-requests/${memberId}/reject`),
  leaveClub: (clubId) => api.post(`${MEMBER_SHIP_BASE}/${clubId}/leave`),

  getMembers: (clubId) => api.get(`${MEMBER_SHIP_BASE}/${clubId}/members`),

  getApprovedMembers: (clubId) => api.get(`${MEMBER_SHIP_BASE}/${clubId}/members/approved`),

  updateMemberStatus: (clubId, memberId, status) =>
    api.put(`${MEMBER_SHIP_BASE}/${clubId}/members/${memberId}/status`, { status }),

  updateMemberRole: (clubId, memberId, role) =>
    api.put(`${MEMBER_SHIP_BASE}/${clubId}/members/${memberId}/role`, { role })
};

export default membershipService;
