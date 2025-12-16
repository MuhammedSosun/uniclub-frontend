import api from "./api";

//  Register doğrulama
export const verifyAccount = async ({ email, code }) => {
  return api.post("/mail/verify", { email, code });
};

//  Forgot password → email’e kod gönderme
export const sendForgotPasswordCode = async (email) => {
  return api.post("/mail/forgot-password", { email });
};

// Şifre sıfırlama için kod doğrulama
export const verifyResetCode = async ({ email, code }) => {
  return api.post("/mail/verify-code", { email, code });
};

// Yeni şifre belirleme
export const resetPassword = async ({ email, code, newPassword, confirmNewPassword }) => {
  return api.post("/mail/reset-password", {
    email,
    code,
    newPassword,
    confirmNewPassword
  });
};
