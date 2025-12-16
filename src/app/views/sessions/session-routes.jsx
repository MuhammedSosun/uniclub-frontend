import { lazy } from "react";

const NotFound = lazy(() => import("./NotFound"));
const ForgotPassword = lazy(() => import("./reset/ForgotPassword"));

const JwtLogin = lazy(() => import("./login/JwtLogin"));
const JwtRegister = lazy(() => import("./register/JwtRegister"));
const JwtVerify = lazy(() => import("./verify/JwtVerify"));

// 🔥 Şifre Sıfırlama Akışı Ekranları
const VerifyResetCode = lazy(() => import("./reset/VerifyResetCode"));
const ResetPassword = lazy(() => import("./reset/ResetPassword"));

const sessionRoutes = [
  { path: "/session/signup", element: <JwtRegister /> },
  { path: "/session/signin", element: <JwtLogin /> },

  // 🔥 Hesap aktivasyon doğrulama
  { path: "/session/verify", element: <JwtVerify /> },

  // 🔥 Şifre sıfırlama akışı
  { path: "/session/forgot-password", element: <ForgotPassword /> },
  { path: "/session/verify-reset", element: <VerifyResetCode /> },
  { path: "/session/reset-password", element: <ResetPassword /> },

  { path: "*", element: <NotFound /> }
];

export default sessionRoutes;
