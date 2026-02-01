import api from "./api";

// ------------------ AUTH ------------------

export const registerUser = async (data) => {
  return api.post("/auth/register", data);
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/authenticate", data);

  // ✔ token kaydediliyor
  if (response?.data?.accessToken) {
    localStorage.setItem("accessToken", response.accessToken);
  }

  return response;
};

export const refreshToken = async (refreshToken) => {
  return api.post("/auth/refreshToken", { refreshToken });
};

// ------------------ USERS ------------------

export const getAllUsers = async () => {
  return api.get("/auth/all/users");
};

export const searchUsers = async (filter = "") => {
  return api.get(`/auth/filter/users`, {
    params: { filter }
  });
};
export const getUsersPaged = async ({
  pageNumber,
  pageSize,
  columnName = "id",
  asc = true,
  filter = ""
}) => {
  return await api.get("/auth/users/paged", {
    params: {
      pageNumber,
      pageSize,
      columnName,
      asc,
      filter
    }
  });
};

export const updateUserRole = async (userId, newRole) => {
  return api.put(`/auth/users/${userId}/role?newRole=${newRole}`);
};

export const logoutUser = async () => {
  localStorage.removeItem("accessToken");
  return api.post("/auth/logout");
};


