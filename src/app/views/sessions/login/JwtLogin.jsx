import { NavLink, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
// Hata Çözümü 1 & 4: jwt-decode ve CSS import'ları Canvas ortamında sorun çıkardığı için kaldırıldı.
// Bu kütüphanelerin işlevlerini simüle edip, CSS'i doğrudan bileşene entegre edeceğiz.
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Hata verdiği için kaldırıldı

import { Box, Card, Grid, Checkbox, TextField, Typography, Button } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
// Hata Çözümü 2: LoadingButton'ı doğrudan MUI Button ile değiştirelim.
// Matx'te LoadingButton genellikle @mui/lab/LoadingButton'dan gelir, 
// bu yol hata verdiği için, Matx'in yerleşik LoadingButton'ını simüle eden
// standart Button ve isSubmitting state'ini kullanacağız.
// import LoadingButton from "@mui/lab/LoadingButton"; // Hata verdiği için kaldırıldı
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";

// Yalova Renk Paleti ve Temel Stiller
const yalovaRed = "#B00020";
const yalovaLightBlue = "#E3F2FD";
const primaryDark = "#1A2038";

// Hata Çözümü 3: useAuth hook'u mock'lanıyor. Projenizin çalışması için gerçek useAuth hook'unuza ihtiyacı vardır.
const useAuth = () => ({
  login: async (username, password) => {
    // Gerçek JWT/API çağrısı burada yapılmalıdır.
    console.log(`Mock Login: ${username} attempted login.`);
    // Hata simülasyonu: Başarılı token dönme mantığı eklenmiştir.
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik11aGFtbWVkIiwiYWRtaW4iOnRydWUsInJvbGUiOiJBRE1JTiIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    localStorage.setItem("accessToken", mockToken);
    return Promise.resolve();
  }
});

// Hata Çözümü 1 (jwtDecode Mock): jwt-decode kütüphanesini simüle ediyoruz.
const jwtDecode = (token) => {
    if (token) {
        // Örnek bir payload döndür
        return { sub: "Yalova Öğrenci", role: "STUDENT" }; 
    }
    return null;
}

// Toastify CSS Mock: React-Toastify CSS'i import edilemediği için,
// temel ToastContainer stilini inline olarak ekleyeceğiz.
const CustomToastContainer = styled(ToastContainer)(({ theme }) => ({
    "& .Toastify__toast--success": {
        backgroundColor: yalovaRed,
        color: yalovaLightBlue,
        borderRadius: '8px',
    },
    "& .Toastify__toast--error": {
        backgroundColor: '#D32F2F', // Kırmızı hata rengi
        color: '#fff',
        borderRadius: '8px',
    },
}));


// ✅ Ana Kapsayıcı: Tam ekran, ortalanmış, kurumsal renge odaklanmış
const StyledRoot = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${primaryDark} 20%, ${theme.palette.background.default} 80%)`,
  padding: '1rem',
  
  "& .login-card": {
    maxWidth: 900,
    minHeight: 500,
    margin: "1rem",
    display: "flex",
    borderRadius: 16,
    alignItems: "stretch", 
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  }
}));

// ✅ Sol Panel (Görsel ve Vurgu)
const VisualBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px',
    textAlign: 'center',
    color: '#fff',
    background: yalovaRed,
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 90%)',
    [theme.breakpoints.down('sm')]: {
        display: 'none', // Mobil cihazlarda sol paneli gizle
    },
}));

// ✅ Form Kapsayıcısı
const FormContentBox = styled(Box)(() => ({
    padding: "32px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
}));

// ✅ Başlangıç değerleri
const initialValues = {
  username: "",
  password: "",
  remember: true,
};

// ✅ Validasyon
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
  
  // Şifre görünürlüğünü yönetmek için state
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      
      // Matx'in useAuth/login fonksiyonu çağrılıyor
      await login(values.username, values.password);

      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        // console.log("Decoded token:", decoded); // Konsol log'u kaldırıldı

        // 🎯 Başarılı giriş bildirimi (Yalova temasına uygun)
        toast.success(`Hoş geldin ${decoded.sub || values.username}!`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          style: { backgroundColor: yalovaRed, color: yalovaLightBlue }
        });

        // 🔹 Rol kontrolü ve yönlendirme
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
      // Hata nesnesinin Matx yapısına uyumlu olduğunu varsayarak hata mesajını göster
      const errorMessage = e.response?.status === 401 || e.response?.status === 404
        ? "Kullanıcı bulunamadı veya şifre hatalı!"
        : "Sunucuya bağlanılamadı, lütfen tekrar deneyin.";
        
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledRoot>
      <CustomToastContainer limit={3} /> 
      <Card className="login-card">
        <Grid container>
          
          {/* Sol taraf: Görsel ve Markalama (Tablet ve Masaüstü) */}
          <Grid item sm={5} xs={12}>
            <VisualBox>
              <Box mb={4}>
                  <img
                    alt="Yalova UniClub Logo"
                    // Logo resminizi buraya ekleyin 
                    src="/assets/images/unilogo.png" 
                    width="150"
                  />
              </Box>
              <Typography variant="h4" fontWeight={800} mb={1}>UniClub Giriş</Typography>
              <Typography variant="subtitle1" opacity={0.8}>Kulüp Yönetim Sistemi'ne erişim.</Typography>
              
              <Box mt={4} p={1} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2" color={yalovaLightBlue}>
                    Öğrenci numaranız ve öğrenci mailiniz ile giriş yapınız.
                </Typography>
              </Box>
            </VisualBox>
          </Grid>

          {/* Sağ taraf: Form */}
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
                    
                    {/* Kullanıcı Adı/Öğrenci No */}
                    <TextField
                      fullWidth
                      size="medium"
                      type="text"
                      name="username"
                      label="Kullanıcı Adı veya Öğrenci No"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.username}
                      onChange={handleChange}
                      helperText={touched.username && errors.username}
                      error={Boolean(errors.username && touched.username)}
                      InputProps={{
                        startAdornment: (
                            <PersonIcon color="action" sx={{ mr: 1 }} />
                        )
                      }}
                      sx={{ mb: 3 }}
                    />

                    {/* Şifre */}
                    <TextField
                      fullWidth
                      size="medium"
                      name="password"
                      type={showPassword ? "text" : "password"} // Görünürlük ayarı
                      label="Şifre"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      InputProps={{
                        startAdornment: (
                            <LockIcon color="action" sx={{ mr: 1 }} />
                        ),
                        endAdornment: (
                            <Button 
                                size="small"
                                onClick={() => setShowPassword(!showPassword)}
                                sx={{ minWidth: 'auto', p: 0.5, color: theme.palette.text.secondary }}
                            >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </Button>
                        )
                      }}
                      sx={{ mb: 1.5 }}
                    />

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        
                        {/* Beni Hatırla */}
                        <Box display="flex" alignItems="center" gap={1}>
                            <Checkbox
                                size="small"
                                name="remember"
                                onChange={handleChange}
                                checked={values.remember}
                                sx={{ padding: 0 }}
                            />
                            <Typography fontSize={13}>Beni Hatırla</Typography>
                        </Box>

                        {/* Şifremi Unuttum */}
                        <NavLink
                            to="/session/forgot-password"
                            style={{ 
                                color: yalovaRed, 
                                fontWeight: 600, 
                                textDecoration: 'none', 
                                fontSize: 13 
                            }}
                        >
                            Şifremi Unuttum?
                        </NavLink>
                    </Box>

                    {/* Giriş Yap Butonu (LoadingButton yerine standart Button kullanıldı) */}
                    <Button
                      type="submit"
                      disabled={isSubmitting} // isSubmitting'i disabled prop'una bağla
                      variant="contained"
                      sx={{ 
                        my: 2,
                        py: 1.5,
                        backgroundColor: yalovaRed,
                        '&:hover': { backgroundColor: '#A0001D' }
                      }}
                    >
                      {isSubmitting ? 'Yükleniyor...' : 'Giriş Yap'}
                    </Button>

                    {/* Kayıt Linki */}
                    <Typography>
                      Hesabın yok mu?
                      <NavLink
                        to="/session/signup"
                        style={{
                          color: yalovaRed,
                          marginLeft: 5,
                          fontWeight: 600,
                          textDecoration: 'none'
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