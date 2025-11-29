import { NavLink, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import LoadingButton from "@mui/lab/LoadingButton";

import useAuth from "app/hooks/useAuth";
import { Paragraph } from "app/components/Typography";

const FlexBox = styled(Box)(() => ({
  display: "flex",
}));

const ContentBox = styled("div")(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
}));

const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1A2038",
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
  ".img-wrapper": {
    height: "100%",
    minWidth: 320,
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const initialValues = {
  username: "",
  password: "",
  remember: true,
};

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Kullanıcı adı veya öğrenci numarası zorunludur!"),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır!")
    .required("Şifre zorunludur!"),
});

export default function JwtLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.username, values.password);

      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // 🎯 Başarılı giriş bildirimi
        toast.success(`Hoş geldin ${decoded.sub || values.username}!`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });

        // 🔹 Admin login kontrolü
        if (decoded.role === "ADMIN" || values.username === "admin") {
          navigate("/dashboard/default");
        } else {
          navigate("/dashboard/default");
        }
      } else {
        toast.error("Giriş başarısız! Token alınamadı.", {
          position: "top-center",
          theme: "colored",
        });
      }
    } catch (e) {
      console.error("Login error:", e);
      if (e.response?.status === 401 || e.response?.status === 404) {
        toast.error("Kullanıcı bulunamadı veya şifre hatalı!", {
          position: "top-center",
          autoClose: 2500,
          theme: "colored",
        });
      } else {
        toast.error("Sunucuya bağlanılamadı, tekrar deneyin.", {
          position: "top-center",
          autoClose: 2500,
          theme: "colored",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledRoot>
      <ToastContainer />
      <Card className="card">
        <Grid container>
          <Grid size={{ sm: 6, xs: 12 }}>
            <div className="img-wrapper">
              <img
                src="/assets/images/illustrations/dreamer.svg"
                width="100%"
                alt="login"
              />
            </div>
          </Grid>

          <Grid size={{ sm: 6, xs: 12 }}>
            <ContentBox>
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
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="username"
                      label="Kullanıcı Adı veya Öğrenci No"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.username}
                      onChange={handleChange}
                      helperText={touched.username && errors.username}
                      error={Boolean(errors.username && touched.username)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Şifre"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />
                        <Paragraph>Beni Hatırla</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Şifremi Unuttum
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={isSubmitting}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Giriş Yap
                    </LoadingButton>

                    <Paragraph>
                      Hesabın yok mu?
                      <NavLink
                        to="/session/signup"
                        style={{
                          color: theme.palette.primary.main,
                          marginLeft: 5,
                        }}
                      >
                        Kayıt Ol
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}
