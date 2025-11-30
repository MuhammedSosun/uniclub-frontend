import { NavLink, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import { Box, Card, Grid, Checkbox, TextField, Typography, Alert, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
// Hata çözümü: LoadingButton, Matx'te genellikle @mui/lab yerine
// doğrudan @mui/material'dan veya Matx'in kendi 'components' klasöründen gelir.
// En güvenli yol, Matx'in projesine özel bir dosya yolu kullanmaktır (Eğer mevcutsa).
// Şimdilik, Matx yapısına uyumlu olmak için LoadingButton'ın var olduğunu varsayalım ve 
// diğer kütüphaneye olan bağımlılığını (Lab) ortadan kaldıralım.
// Eğer LoadingButton hala hata verirse, standart MUI Button bileşenine geçmek gerekir.
import LoadingButton from "@mui/lab/LoadingButton"; 
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmailIcon from '@mui/icons-material/Email';

// Yalova Renk Paleti
const yalovaRed = "#B00020";
const yalovaLightBlue = "#E3F2FD";
const primaryDark = "#1A2038";

// LOGO STİLİ İÇİN YENİ STYLED COMPONENT EKLENDİ
const LogoImage = styled('img')(({ theme }) => ({
    width: "150px",
    height: "auto",
    // Şeffaf arka plan denemesi:
    backgroundColor: 'transparent', 
    objectFit: 'contain',
}));

// Ana Kapsayıcı
const JWTRegisterWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${primaryDark} 20%, ${theme.palette.background.default} 80%)`,
  padding: '1rem',
  
  "& .register-card": {
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

// Sol Panel (Görsel ve Vurgu)
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
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));

// Başlangıç değerleri ve Validasyon aynı kalır
const initialValues = {
  email: "",
  password: "",
  remember: true
};

const validationSchema = Yup.object().shape({
 email: Yup.string()
  .matches(
    /^[0-9]{9}@ogrenci\.yalova\.edu\.tr$/,
    "Lütfen 9 haneli öğrenci numaranızı içeren geçerli bir Y.Ü. e-postası girin."
  )
  .required("Üniversite E-postası zorunludur!"),

  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur!")
    .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        "Şifreniz en az bir harf ve bir rakam içermelidir."
    )
});

export default function JwtRegister() {
  const theme = useTheme();
  const { register } = { register: async () => {} }; 
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setSubmitting(true);
      // await register(values.email, values.password); 
      
      setStatus({ success: true, message: "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz..." });

      setTimeout(() => {
        navigate("/session/signin"); 
      }, 1500);

    } catch (e) {
      console.error("Register error:", e);
      setStatus({ success: false, message: e.message || "Kayıt işlemi başarısız oldu." });
    } finally {
      // setSubmitting(false); 
    }
  };

  return (
    <JWTRegisterWrapper>
      <Card className="register-card">
        <Grid container>
          
          {/* Sol taraf: Görsel ve Markalama (Sadece Masaüstü) */}
          <Grid item md={5} sm={12}>
            <VisualBox>
              <Box mb={4}>
                  <LogoImage
                    alt="Yalova UniClub Logo"
                    // Logo resminizi bu yoldan çağırın
                    src="/assets/images/unilogo.png" 
                  />
              </Box>
              <Typography variant="h4" fontWeight={800} mb={1}>UniClub'a Hoş Geldiniz!</Typography>
              <Typography variant="subtitle1" opacity={0.8}>Kulüplere katıl, etkinliklere anında eriş.</Typography>
              
              <Box mt={3} p={1} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2" color={yalovaLightBlue}>
                    Sadece <b>@ogrenci.yalova.edu.tr</b> e-posta adresiyle kayıt yapılabilir.
                </Typography>
              </Box>
            </VisualBox>
          </Grid>

          {/* Sağ taraf: Kayıt Formu */}
          <Grid item md={7} sm={12} xs={12}>
            <Box p={{ xs: 3, sm: 4 }} height="100%" display="flex" flexDirection="column" justifyContent="center">
                
                <Typography variant="h5" mb={1} fontWeight={600} color={primaryDark}>
                    <LockOpenIcon sx={{ mr: 1, color: yalovaRed }} />
                    Öğrenci Kayıt Formu
                </Typography>
                <Typography variant="subtitle2" mb={3} color="text.secondary">
                    Yeni bir UniClub hesabı oluşturun.
                </Typography>

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
                  handleSubmit,
                  status
                }) => (
                  <form onSubmit={handleSubmit}>

                    {/* Hata ve Başarı Mesajları */}
                    {status && status.message && (
                        <Alert 
                            severity={status.success ? "success" : "error"} 
                            sx={{ mb: 3, borderRadius: 1 }}
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
                      label="Üniversite E-Postası (ör: 210101068@...)"
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

                    {/* Şifre alanı */}
                    <TextField
                      fullWidth
                      size="medium"
                      name="password"
                      type="password"
                      label="Şifre (Min. 6 karakter, En az 1 harf ve 1 rakam)"
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
                      <Typography fontSize={13} color="text.secondary">
                        <NavLink to="/terms" style={{ color: yalovaRed, textDecoration: 'none', fontWeight: 600 }}>
                            Kullanım Şartlarını
                        </NavLink>
                        {' '}okudum ve kabul ediyorum.
                      </Typography>
                    </Box>

                    {/* Gönder butonu */}
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      disabled={!values.remember}
                      sx={{ 
                        mb: 2, 
                        mt: 3, 
                        py: 1.5,
                        backgroundColor: yalovaRed,
                        '&:hover': { backgroundColor: '#A0001D' }
                      }}
                    >
                      Kayıt Ol
                    </LoadingButton>

                    {/* Giriş linki */}
                    <Typography>
                      Zaten bir hesabın var mı?
                      <NavLink
                        to="/session/signin"
                        style={{ color: yalovaRed, marginLeft: 5, fontWeight: 600 }}
                      >
                        Giriş Yap
                      </NavLink>
                    </Typography>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTRegisterWrapper>
  );
}