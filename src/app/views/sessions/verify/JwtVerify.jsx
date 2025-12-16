import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Card,
  TextField,
  Typography,
  Alert
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { verifyAccount } from "../../../services/mailService";

const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, "Kod 6 haneli olmalıdır")
    .required("Doğrulama kodu zorunludur!")
});

export default function JwtVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  // Register ekranından email'i çektik
  const email = location?.state?.email;

  if (!email) {
    return (
      <Box p={5}>
        <Alert severity="error">
          Email bilgisi bulunamadı. Lütfen tekrar kayıt olun.
        </Alert>
      </Box>
    );
  }

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setSubmitting(true);

      const response = await verifyAccount({
        email: email,
        code: values.code
      });

      setStatus({
        success: true,
        message:
          typeof response === "string"
            ? response
            : response?.message || "Doğrulama başarılı!"
      });

      // 1.5 saniye sonra giriş ekranına gönder
      setTimeout(() => {
        navigate("/session/signin");
      }, 1500);

    } catch (e) {
      setStatus({
        success: false,
        message:
          e?.response?.data ||
          e.message ||
          "Kod doğrulanamadı. Lütfen tekrar deneyin."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: primaryDark }}
      p={3}
    >
      <Card sx={{ p: 4, maxWidth: 450, width: "100%", borderRadius: 3 }}>
        <Typography variant="h5" mb={2} fontWeight={600} color={primaryDark}>
          Hesabınızı Doğrulayın
        </Typography>

        <Typography mb={3}>
          <b>{email}</b> adresine gönderilen 6 haneli doğrulama kodunu girin.
        </Typography>

        <Formik
          initialValues={{ code: "" }}
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
            status
          }) => (
            <form onSubmit={handleSubmit}>
              {status?.message && (
                <Alert severity={status.success ? "success" : "error"} sx={{ mb: 2 }}>
                  {status.message}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Doğrulama Kodu"
                name="code"
                variant="outlined"
                value={values.code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(errors.code && touched.code)}
                helperText={touched.code && errors.code}
                sx={{ mb: 3 }}
              />

              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{
                  py: 1.5,
                  backgroundColor: yalovaRed,
                  "&:hover": { backgroundColor: "#A0001D" }
                }}
              >
                Doğrula
              </LoadingButton>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
}
