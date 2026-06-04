import api from "./api";

export async function getAiRecommendations() {
  return await api.post("/ai/recommendations/me");
}
