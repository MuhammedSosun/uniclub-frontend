import { NavLink, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Card, TextField, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import EmailIcon from '@mui/icons-material/Email';
import LockResetIcon from '@mui/icons-material/LockReset';

import { sendForgotPasswordCode } from "../../../services/mailService";

// Yalova renk paleti
const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

const CustomToastContainer = styled(ToastContainer)(() => ({
  "& .Toastify__toast--success": {
    backgroundColor: yalovaRed,
    color: "white",
    borderRadius: "8px"
  },
  "& .Toastify__toast--error": {
    backgroundColor: "#D32F2F",
    color: "white",
    borderRadius: "8px"
  }
}));

const StyledRoot = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${primaryDark} 20%, ${theme.palette.background.default} 80%)`,
  padding: "1rem",
  "& .reset-card": {
    maxWidth: 500,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    padding: "32px",
    textAlign: "center"
  }
}));

const initialValues = {
  email: ""
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi girin.")
    .matches(/^[0-9]{9}@ogrenci\.yalova\.edu\.tr$/, "Lütfen geçerli bir üniversite e-postası girin.")
    .required("E-posta adresi zorunludur!")
});

export default function ForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setSubmitting(true);
      setStatus(null);

      // 🔥 GERÇEK BACKEND'E POST
      const response = await sendForgotPasswordCode(values.email);

      setStatus({ success: true, message: "Kod email adresinize gönderildi." });

      toast.success("Kod email adresinize gönderildi.", {
        position: "top-center",
        autoClose: 3000
      });

      //  verify-reset ekranına yönlendir
      navigate("/session/verify-reset", {
        state: { email: values.email }
      });

    } catch (e) {
      const msg = e?.response?.data || "Bir hata oluştu!";
      setStatus({ success: false, message: msg });

      toast.error(msg, { position: "top-center", autoClose: 4000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledRoot>
      <CustomToastContainer limit={1} />

      <Card className="reset-card">
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            status
          }) => (
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              
              <LockResetIcon sx={{ fontSize: 60, color: yalovaRed, mb: 2 }} />
              <Typography variant="h5" fontWeight={600} color={primaryDark}>
                Şifre Sıfırlama
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Kayıtlı üniversite e-posta adresinizi girin.
              </Typography>

              {status?.message && (
                <Alert severity={status.success ? "success" : "error"} sx={{ mb: 2 }}>
                  {status.message}
                </Alert>
              )}

              <TextField
                fullWidth
                type="email"
                name="email"
                label="Üniversite E-Postası"
                variant="outlined"
                onBlur={handleBlur}
                value={values.email}
                onChange={handleChange}
                error={Boolean(errors.email && touched.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                sx={{
                  py: 1.5,
                  width: "100%",
                  backgroundColor: yalovaRed,
                  "&:hover": { backgroundColor: "#A0001D" }
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Doğrulama Kodu Gönder"
                )}
              </Button>

              <NavLink
                to="/session/signin"
                style={{
                  color: yalovaRed,
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: 13,
                  marginTop: 16,
                  display: "inline-block"
                }}
              >
                Giriş sayfasına geri dön
              </NavLink>
            </form>
          )}
        </Formik>
      </Card>
    </StyledRoot>
  );
}
