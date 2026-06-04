import { NavLink, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Card, Grid, Checkbox, TextField, Typography, Button } from "@mui/material";

import { styled, useTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useState } from "react";
import useAuth from "app/hooks/useAuth"; // ✔ GERÇEK HOOK

// 🔴 Yalova renk paleti
const yalovaRed = "#B00020";
const yalovaLightBlue = "#E3F2FD";
const primaryDark = "#1A2038";

const StyledRoot = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${primaryDark} 20%, ${theme.palette.background.default} 80%)`,
  padding: "1rem",

  "& .login-card": {
    maxWidth: 900,
    minHeight: 500,
    margin: "1rem",
    display: "flex",
    borderRadius: 16,
    alignItems: "stretch",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    overflow: "hidden"
  }
}));

const VisualBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "32px",
  textAlign: "center",
  color: "#fff",
  background: yalovaRed,
  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 90%)",
  [theme.breakpoints.down("sm")]: {
    display: "none"
  }
}));

const FormContentBox = styled(Box)(() => ({
  padding: "32px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
}));

const initialValues = {
  username: "",
  password: "",
  remember: true
};

// ✔ Validasyon
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Kullanıcı adı veya öğrenci numarası zorunludur!"),
  password: Yup.string().min(6, "Şifre en az 6 karakter olmalıdır!").required("Şifre zorunludur!")
});

export default function JwtLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth(); // ✔ GERÇEK AUTH

  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      // 🔥 GERÇEK BACKEND LOGIN
      await login(values.username, values.password);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Token alınamadı!", {
          position: "top-center",
          theme: "colored"
        });
        return;
      }

      const decoded = jwtDecode(token);

      // 🎉 Başarılı giriş
      toast.success(`Hoş geldin ${decoded.sub || values.username}!`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        style: { backgroundColor: yalovaRed, color: yalovaLightBlue }
      });

      // 🔥 ROL KONTROL + YÖNLENDİRME
      if (decoded.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const status = error.response?.status;

      if (status === 401 || status === 404) {
        toast.error("Kullanıcı adı veya şifre hatalı!", {
          position: "top-center",
          theme: "colored"
        });
      } else {
        toast.error("Sunucuya bağlanılamadı, lütfen tekrar deneyin.", {
          position: "top-center",
          theme: "colored"
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledRoot>
      <ToastContainer limit={3} />

      <Card className="login-card">
        <Grid container>
          {/* SOL PANEL */}
          <Grid item sm={5} xs={12}>
            <VisualBox>
              <Box mb={4}>
                <img src="/assets/images/unilogo.png" width="150" alt="Logo" />
              </Box>
              <Typography variant="h4" fontWeight={800} mb={1}>
                UniClub Giriş
              </Typography>
              <Typography variant="subtitle1" opacity={0.8}>
                Kulüp Yönetim Sistemi'ne erişim.
              </Typography>

              <Box
                mt={4}
                p={1}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" color={yalovaLightBlue}>
                  Öğrenci numaranız ile giriş yapınız.
                </Typography>
              </Box>
            </VisualBox>
          </Grid>

          {/* SAĞ FORM */}
          <Grid item sm={7} xs={12}>
            <FormContentBox>
              <Typography variant="h5" mb={1} fontWeight={600} color={primaryDark}>
                <LoginIcon sx={{ mr: 1, color: yalovaRed }} />
                Kullanıcı Girişi
              </Typography>

              <Typography variant="subtitle2" mb={3} color="text.secondary">
                Hesabınıza erişmek için bilgilerinizi girin.
              </Typography>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit
                }) => (
                  <form onSubmit={handleSubmit}>
                    {/* Kullanıcı Adı */}
                    <TextField
                      fullWidth
                      size="medium"
                      name="username"
                      label="Kullanıcı Adı"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      helperText={touched.username && errors.username}
                      error={Boolean(errors.username && touched.username)}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1 }} />
                      }}
                      sx={{ mb: 3 }}
                    />

                    {/* Şifre */}
                    <TextField
                      fullWidth
                      size="medium"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      label="Şifre"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      InputProps={{
                        startAdornment: <LockIcon sx={{ mr: 1 }} />,
                        endAdornment: (
                          <Button
                            size="small"
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ minWidth: "auto", p: 0.5 }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </Button>
                        )
                      }}
                      sx={{ mb: 2 }}
                    />

                    {/* Beni Hatırla + Şifremi Unuttum */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Checkbox
                          name="remember"
                          checked={values.remember}
                          onChange={handleChange}
                        />
                        <Typography fontSize={13}>Beni Hatırla</Typography>
                      </Box>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: yalovaRed, fontWeight: 600 }}
                      >
                        Şifremi Unuttum?
                      </NavLink>
                    </Box>

                    {/* Giriş Yap Button */}
                    <Button
                      fullWidth
                      type="submit"
                      disabled={isSubmitting}
                      variant="contained"
                      sx={{
                        my: 2,
                        py: 1.5,
                        backgroundColor: yalovaRed,
                        "&:hover": { backgroundColor: "#A0001D" }
                      }}
                    >
                      {isSubmitting ? "Yükleniyor..." : "Giriş Yap"}
                    </Button>

                    {/* Kayıt Ol */}
                    <Typography mt={1}>
                      Hesabın yok mu?
                      <NavLink
                        to="/session/signup"
                        style={{
                          color: yalovaRed,
                          marginLeft: 5,
                          fontWeight: 600
                        }}
                      >
                        Kayıt Ol
                      </NavLink>
                    </Typography>
                  </form>
                )}
              </Formik>
            </FormContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}
