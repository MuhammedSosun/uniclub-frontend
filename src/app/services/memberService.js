import api from "./api";

const MEMBER_BASE = "/member";

const memberService = {
  // GET /api/member/me
  getMyProfile: () => api.get(`${MEMBER_BASE}/me`),

  // PUT /api/member/me
  updateMyProfile: (profileData) =>
    api.put(`${MEMBER_BASE}/me`, profileData),
};

export default memberService;
