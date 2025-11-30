import { NavLink, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Bu import'un projenizde çalıştığını varsayıyoruz.

import { Box, Card, Grid, TextField, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import EmailIcon from '@mui/icons-material/Email';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useState } from "react";

// Yalova Renk Paleti
const yalovaRed = "#B00020";
const yalovaLightBlue = "#E3F2FD";
const primaryDark = "#1A2038"; // Matx koyu arka plan rengi

// Hata Çözümü: ToastContainer için global stil (Daha önceki çözümden aktarıldı)
const CustomToastContainer = styled(ToastContainer)(() => ({
    "& .Toastify__toast--success": {
        backgroundColor: yalovaRed,
        color: 'white',
        borderRadius: '8px',
    },
    "& .Toastify__toast--error": {
        backgroundColor: '#D32F2F', 
        color: 'white',
        borderRadius: '8px',
    },
}));


// ✅ Ana Kapsayıcı: Giriş ve Kayıt sayfalarıyla aynı modern stili korur
const StyledRoot = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${primaryDark} 20%, ${theme.palette.background.default} 80%)`,
  padding: '1rem',
  
  "& .reset-card": {
    maxWidth: 500, // Daha küçük form olduğu için kartı küçültüldü
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    padding: '32px',
    textAlign: 'center',
  }
}));

// ✅ Başlangıç değerleri
const initialValues = {
  email: "",
};

// ✅ Validasyon: Sadece üniversite e-postası formatı kontrol edilir
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir e-posta adresi girin.")
    .matches(
        /^[0-9]{9}@ogrenci\.yalova\.edu\.tr$/,
        "Lütfen 9 haneli öğrenci numaranızı içeren geçerli bir Y.Ü. e-postası girin."
    )
    .required("E-posta adresi zorunludur!"),
});

// Mock: Şifre sıfırlama talebi gönderen fonksiyonu simüle eder (Backend'e POST isteği yapacaktır)
const sendResetLink = async (email) => {
    // Gerçek uygulamada: await axios.post('/api/auth/forgot-password', { email });
    console.log(`Backend'e sıfırlama isteği gönderiliyor: ${email}`);
    
    // Başarılı veya hatalı cevap simülasyonu (rastgele hata veya başarı)
    const isSuccess = Math.random() > 0.1; // %90 başarı şansı
    
    return new Promise((resolve, reject) => setTimeout(() => {
        if (isSuccess) {
            resolve({ message: "Sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin." });
        } else {
            // Backend 404/401 döndürdüğünde simüle edilen hata
            reject({ message: "Bu e-posta adresi sistemimizde kayıtlı değil.", status: 404 });
        }
    }, 1500));
};


export default function ForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setSubmitting(true);
      setStatus(null); // Önceki mesajları temizle
      
      const response = await sendResetLink(values.email);

      setStatus({ success: true, message: response.message });
      toast.success(response.message, {
        position: "top-center",
        autoClose: 5000,
      });
      
      // Başarılı gönderimden sonra formu temizle
      // setTimeout(() => { navigate("/session/signin"); }, 5000); // 5 saniye sonra giriş sayfasına yönlendirilebilir.

    } catch (e) {
      console.error("Forgot Password error:", e);
      
      const errorMessage = e.status === 404
        ? e.message // Mock'tan gelen özel mesaj
        : "İsteğiniz işlenirken bir sorun oluştu. Lütfen tekrar deneyin.";
        
      setStatus({ success: false, message: errorMessage });
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });

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
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                
                <LockResetIcon sx={{ fontSize: 60, color: yalovaRed, mb: 2 }} />
                
                <Typography variant="h5" mb={1} fontWeight={600} color={primaryDark}>
                    Şifre Sıfırlama
                </Typography>
                <Typography variant="subtitle2" mb={3} color="text.secondary">
                    Kayıtlı üniversite e-posta adresinizi girin.
                </Typography>

                {/* Hata ve Başarı Mesajları */}
                {status && status.message && (
                    <Alert 
                        severity={status.success ? "success" : "error"} 
                        sx={{ mb: 3, width: '100%', borderRadius: 1 }}
                    >
                        {status.message}
                    </Alert>
                )}

                {/* E-mail alanı */}
                <TextField
                  fullWidth
                  size="medium"
                  type="email"
                  name="email"
                  label="Üniversite E-Postası"
                  variant="outlined"
                  onBlur={handleBlur}
                  value={values.email}
                  onChange={handleChange}
                  helperText={touched.email && errors.email}
                  error={Boolean(errors.email && touched.email)}
                  InputProps={{
                    startAdornment: (
                        <EmailIcon color="action" sx={{ mr: 1 }} />
                    )
                  }}
                  sx={{ mb: 3 }}
                />

                {/* Gönder butonu */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  sx={{ 
                    my: 2,
                    py: 1.5,
                    width: '100%',
                    backgroundColor: yalovaRed,
                    '&:hover': { backgroundColor: '#A0001D' }
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sıfırlama Bağlantısı Gönder'}
                </Button>

                {/* Giriş Linki */}
                <NavLink
                    to="/session/signin"
                    style={{ 
                        color: yalovaRed, 
                        fontWeight: 600, 
                        textDecoration: 'none', 
                        fontSize: 13,
                        marginTop: 8
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