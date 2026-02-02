import api from "./api";

const MEMBER_BASE = "/member";

const memberService = {
  getMyProfile: () => api.get(`${MEMBER_BASE}/me`),

  updateMyProfile: (profileData) => api.put(`${MEMBER_BASE}/me`, profileData),
  getById: (id) => api.get(`${MEMBER_BASE}/${id}`),

  getAllPaged: (params) => api.get(MEMBER_BASE, { params })
};

export const getActiveMemberCount = async () => {
  return api.get(`${MEMBER_BASE}/count`);
};

export default memberService;
