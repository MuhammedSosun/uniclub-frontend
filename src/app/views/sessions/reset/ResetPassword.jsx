import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

import {
  Box,
  Card,
  TextField,
  Typography,
  Alert
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import { resetPassword } from "../../../services/mailService";

// 🎨 Yalova Renk Teması
const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

// Arka plan tasarımı
const StyledWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${primaryDark} 20%, ${theme.palette.background.default} 80%)`,
  padding: "1rem",
}));

// Form kart tasarımı
const FormCard = styled(Card)(() => ({
  width: "100%",
  maxWidth: 500,
  padding: "32px",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
}));

// Form için validasyon
const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur."),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Şifreler uyuşmuyor.")
    .required("Şifre tekrarı zorunludur."),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // **Email + Code state üzerinden gelmeli!**
  const email = location?.state?.email;
  const code = location?.state?.code;

  // Eğer doğrulama yapılmadan buraya gelinmişse hata göster
  if (!email || !code) {
    return (
      <StyledWrapper>
        <FormCard>
          <Alert severity="error">
            Geçersiz işlem. Lütfen şifre sıfırlama adımlarını yeniden başlatın.
          </Alert>
        </FormCard>
      </StyledWrapper>
    );
  }

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setSubmitting(true);

      const response = await resetPassword({
        email,
        code,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });

      setStatus({
        success: true,
        message: response?.message || "Şifre başarıyla değiştirildi.",
      });

      // 1.5 sn sonra giriş ekranına yönlendir
      setTimeout(() => {
        navigate("/session/signin");
      }, 1500);

    } catch (err) {
      setStatus({
        success: false,
        message:
          err?.response?.data ||
          err?.message ||
          "Şifre değiştirilemedi, lütfen tekrar deneyin.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledWrapper>
      <FormCard>
        <Typography variant="h5" fontWeight={700} mb={1} color={primaryDark}>
          Yeni Şifre Oluştur
        </Typography>

        <Typography mb={3} color="text.secondary">
          <b>{email}</b> adresi için yeni bir şifre belirleyin.
        </Typography>

        <Formik
          initialValues={{ newPassword: "", confirmNewPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            status,
          }) => (
            <form onSubmit={handleSubmit}>
              {/* Hata / Başarı mesajı */}
              {status && status.message && (
                <Alert
                  severity={status.success ? "success" : "error"}
                  sx={{ mb: 2 }}
                >
                  {status.message}
                </Alert>
              )}

              {/* Yeni Şifre */}
              <TextField
                fullWidth
                label="Yeni Şifre"
                name="newPassword"
                type="password"
                variant="outlined"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(errors.newPassword && touched.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
                sx={{ mb: 3 }}
              />

              {/* Yeni Şifre Tekrar */}
              <TextField
                fullWidth
                label="Yeni Şifre (Tekrar)"
                name="confirmNewPassword"
                type="password"
                variant="outlined"
                value={values.confirmNewPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(
                  errors.confirmNewPassword && touched.confirmNewPassword
                )}
                helperText={
                  touched.confirmNewPassword && errors.confirmNewPassword
                }
                sx={{ mb: 3 }}
              />

              {/* Gönder butonu */}
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{
                  py: 1.5,
                  backgroundColor: yalovaRed,
                  "&:hover": { backgroundColor: "#A0001D" },
                }}
              >
                Şifreyi Değiştir
              </LoadingButton>
            </form>
          )}
        </Formik>
      </FormCard>
    </StyledWrapper>
  );
}
