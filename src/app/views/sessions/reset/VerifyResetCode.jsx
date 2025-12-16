import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import VerifiedIcon from "@mui/icons-material/Verified";

import { verifyResetCode } from "../../../services/mailService";

const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

const StyledRoot = styled(Box)(() => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${primaryDark} 20%, #2c2c3e 80%)`,
  padding: "1rem",
  "& .verify-card": {
    maxWidth: 450,
    minHeight: 380,
    margin: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 16,
    padding: "32px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
  }
}));

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .required("Kod zorunludur!")
    .length(6, "Kod 6 haneli olmalıdır.")
});

export default function VerifyResetCode() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  if (!email) {
    return (
      <StyledRoot>
        <Card className="verify-card">
          <Alert severity="error">E-posta bulunamadı. Tekrar deneyin.</Alert>
        </Card>
      </StyledRoot>
    );
  }

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setSubmitting(true);
      setStatus(null);

      await verifyResetCode({
        email,
        code: values.code
      });

      toast.success("Kod doğrulandı!", { position: "top-center" });

      navigate("/session/reset-password", {
        state: { email, code: values.code }
      });
    } catch (e) {
      const msg = e?.response?.data || "Kod doğrulanamadı!";
      setStatus({ success: false, message: msg });
      toast.error(msg, { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledRoot>
      <ToastContainer limit={1} />
      <Card className="verify-card">
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
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <VerifiedIcon sx={{ fontSize: 60, color: yalovaRed, mb: 2 }} />
              <Typography variant="h5" fontWeight={600} color={primaryDark}>
                Kod Doğrulama
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {email} adresine gönderilen doğrulama kodunu giriniz.
              </Typography>

              {status?.message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {status.message}
                </Alert>
              )}

              <TextField
                fullWidth
                name="code"
                label="6 Haneli Kod"
                variant="outlined"
                value={values.code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(errors.code && touched.code)}
                helperText={touched.code && errors.code}
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
                  "Doğrula"
                )}
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </StyledRoot>
  );
}
