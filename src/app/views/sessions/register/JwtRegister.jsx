import { NavLink, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import LoadingButton from "@mui/lab/LoadingButton";
import JustifyBox from "app/components/JustifyBox";

import useAuth from "app/hooks/useAuth";
import { Paragraph } from "app/components/Typography";

// ✅ Görsel yapı
const ContentBox = styled("div")(() => ({
  height: "100%",
  padding: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0, 0, 0, 0.01)"
}));

const JWTRegister = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center"
  }
}));

// ✅ Başlangıç değerleri (sadece email ve password)
const initialValues = {
  email: "",
  password: "",
  remember: true
};

// ✅ Validasyon (email zorunlu, password min. 6 karakter)
const validationSchema = Yup.object().shape({
 email: Yup.string()
  .matches(
    /^[0-9]{9}@ogrenci\.yalova\.edu\.tr$/,
    "Geçerli bir öğrenci e-postası girin (ör: 210201056@ogrenci.yalova.edu.tr)"
  )
  .required("E-posta zorunludur!"),

  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur!")
});

export default function JwtRegister() {
  const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      await register(values.email, values.password);
      navigate("/session/signin"); // ✅ Login sayfasına yönlendir
    } catch (e) {
      console.error("Register error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <JWTRegister>
      <Card className="card">
        <Grid container>
          {/* Sol taraf: görsel */}
          <Grid size={{ md: 6, xs: 12 }}>
            <ContentBox>
              <img
                width="100%"
                alt="Register"
                src="/assets/images/illustrations/posting_photo.svg"
              />
            </ContentBox>
          </Grid>

          {/* Sağ taraf: form */}
          <Grid size={{ md: 6, xs: 12 }}>
            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}>
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
                    {/* E-mail alanı */}
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Üniversite E-Postası"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    {/* Şifre alanı */}
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
                      sx={{ mb: 2 }}
                    />

                    {/* Onay kutusu */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={handleChange}
                        checked={values.remember}
                        sx={{ padding: 0 }}
                      />
                      <Paragraph fontSize={13}>
                        Kullanım şartlarını okudum ve kabul ediyorum.
                      </Paragraph>
                    </Box>

                    {/* Gönder butonu */}
                    <LoadingButton
                      type="submit"
                      color="primary"
                      variant="contained"
                      loading={isSubmitting}
                      sx={{ mb: 2, mt: 3 }}
                    >
                      Kayıt Ol
                    </LoadingButton>

                    {/* Giriş linki */}
                    <Paragraph>
                      Zaten bir hesabın var mı?
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Giriş Yap
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTRegister>
  );
}
