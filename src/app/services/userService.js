import axios from "axios";

export const getAllUsers = async (filter = "") => {
  try {
    const token = localStorage.getItem("accessToken");

    const url = filter
      ? `auth/filter/users?filter=${filter}`
      : "auth/all/users";

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("getAllUsers error:", err);
    throw err;
  }
};
