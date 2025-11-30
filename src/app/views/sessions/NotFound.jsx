import { Box, Button, Typography, Container } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// --- TEMA RENKLERİ ---
const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

// --- ANİMASYONLAR ---
// Görselin havada süzülme efekti (Daha hızlı ve dikkat çekici hale getirildi)
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

// --- STYLED COMPONENTS ---

const NotFoundRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  // Daha yüksek kontrastlı, dramatik gradient arka plan
  background: `linear-gradient(135deg, ${primaryDark} 10%, #080a10 100%)`, 
  position: 'relative',
  overflow: 'hidden',
}));

// Arka plandaki dev "404" yazısı
const BigTextBackground = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '25rem', // Devasa boyut
    fontWeight: 900,
    color: 'rgba(255, 255, 255, 0.05)', // Daha belirgin ama hala saydam beyaz
    zIndex: 0,
    userSelect: 'none',
    lineHeight: 1,
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    [theme.breakpoints.down("md")]: {
        fontSize: '15rem',
    },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
}));

const FloatingImage = styled("img")({
  maxWidth: "100%",
  width: "400px",
  marginBottom: "2rem",
  animation: `${float} 4s ease-in-out infinite`, // Animasyon süresi 6s'den 4s'ye düşürüldü
  filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))', // Daha belirgin gölge
});

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <NotFoundRoot>
      {/* Arka Plan Dev Yazı */}
      <BigTextBackground variant="h1">404</BigTextBackground>

      <Container maxWidth="md">
        <ContentWrapper>
          
          {/* Görsel */}
          <FloatingImage 
            src="/assets/images/illustrations/404.svg" 
            alt="404 Not Found" 
          />

          {/* Hata Mesajları */}
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
                color: '#fff', 
                fontWeight: 800, // Daha kalın font
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: 3, // Daha fazla aralık
                textShadow: '0 0 10px rgba(255,255,255,0.2)' // Metin gölgesi
            }}
          >
            Sayfa Bulunamadı
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
                color: '#B0B8C4', 
                mb: 4, 
                maxWidth: '500px',
                fontSize: '1.1rem',
                lineHeight: 1.6
            }}
          >
            Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir. Kaybolmuş gibi görünüyorsunuz!
          </Typography>

          {/* Buton Grubu */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            
            <Button 
                variant="contained" 
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/dashboard/default")}
                sx={{
                    backgroundColor: yalovaRed,
                    color: '#fff',
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    // Daha agresif gölge efekti
                    boxShadow: '0 8px 20px 0 rgba(176, 0, 32, 0.5)', 
                    '&:hover': {
                        backgroundColor: '#8a0019',
                        boxShadow: '0 10px 30px 0 rgba(176, 0, 32, 0.7)', // Hover'da belirginleşme
                    }
                }}
            >
              Ana Sayfaya Dön
            </Button>

            <Button 
                variant="outlined" 
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{
                    borderColor: 'rgba(255,255,255,0.5)', // Daha belirgin border
                    color: '#fff',
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                        borderColor: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                }}
            >
              Geri Gel
            </Button>

          </Box>

        </ContentWrapper>
      </Container>
    </NotFoundRoot>
  );
}