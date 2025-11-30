import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useTheme, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import PublicIcon from '@mui/icons-material/Public';
import CodeIcon from '@mui/icons-material/Code';

// --- MOCK DEPENDENCIES (Gerçek uygulamada bu kısımlar app/utils ve app/hooks'tan gelmelidir) ---
const topBarHeight = 64;

// Basit bir settings mock'u
const mockTheme = createTheme({
  palette: {
    primary: { main: '#B00020' },
    secondary: { main: '#E3F2FD' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  }
});

const useSettings = () => ({
  settings: {
    footer: { theme: 'dark' },
    themes: { dark: mockTheme }
  }
});
// ------------------------------------------------------------------------------------

// Yalova Üniversitesi Renk Paleti ve Modernleştirilmiş Renkler
const yalovaRed = "#B00020"; // Ana Kurumsal Kırmızı
const yalovaLightBlue = "#E3F2FD"; // Çok Açık Mavi/Beyaz
const footerBg = "#151515"; // Koyu Arka Plan
const footerText = yalovaLightBlue;

// Dinamik Dalgalı Ayırıcı (SVG)
const WaveDivider = ({ color }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      lineHeight: 0,
      transform: 'translateY(-100%)', // Footer'ın üstüne oturt
      zIndex: 90,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 -2px 1px rgba(0,0,0,0.1))',
    }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1440 100" 
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: '10vh', minHeight: '50px', maxHeight: '100px' }}
    >
      <path 
        fill={color} 
        fillOpacity="1" 
        d="M0,32L60,48C120,64,240,96,360,96C480,96,600,64,720,53.3C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,32L1380,32C1320,32,1200,32,1080,32C960,32,840,32,720,32C600,32,480,32,360,32C240,32,120,32,60,32L0,32Z"
      ></path>
    </svg>
  </Box>
);

// Ana Footer Bileşeni
export default function Footer() {
  const theme = useTheme();
  const { settings } = useSettings();

  // Settings'ten gelen tema yerine koyu bir tema oluşturuyoruz.
  const customFooterTheme = createTheme({
    palette: {
      primary: { main: yalovaRed },
      secondary: { main: yalovaLightBlue },
      background: { default: footerBg },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(176, 0, 32, 0.4)',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={customFooterTheme}>
      <AppBar
        position="relative" // 'static' yerine 'relative' kullanarak dalgayı pozisyonlayacağız
        elevation={0}
        sx={{
          zIndex: 96,
          background: footerBg,
          minHeight: topBarHeight * 2,
          position: 'relative', // Dalga için
          borderTop: `5px solid ${yalovaRed}`, // Üst kısımda kırmızı bir çizgi
        }}
      >
        {/* Dalgalı Ayırıcı Bileşeni */}
        <WaveDivider color={footerBg} />

        <Container 
          maxWidth="xl" 
          sx={{ 
            height: '100%', 
            py: { xs: 4, md: 6 } 
          }}
        >
          <Toolbar disableGutters sx={{ minHeight: 'unset', flexWrap: 'wrap', p: 0 }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                gap: { xs: 3, md: 4 },
              }}
            >
              {/* KOLON 1: YALOVA ÜNİVERSİTESİ BUTONU */}
              <Box sx={{ flexShrink: 0, order: { xs: 2, md: 1 } }}>
                <Button
                  variant="contained"
                  startIcon={<PublicIcon />}
                  sx={{
                    background: yalovaRed,
                    color: footerText,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    borderRadius: 8, // Daha yumuşak yuvarlaklık
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: '0.85rem', sm: '1rem' },
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    "&:hover": {
                      background: '#A0001D', // Hafifçe koyu ton
                      boxShadow: '0 6px 20px rgba(176, 0, 32, 0.5)',
                    }
                  }}
                  onClick={() => window.open("https://www.yalova.edu.tr/", "_blank")}
                >
                  Yalova Üniversitesi Resmi Sitesi
                </Button>
              </Box>

              {/* KOLON 2: MERKEZ METİN (TELİF HAKKI VE BAŞLIK) */}
              <Box
                sx={{
                  textAlign: { xs: 'center', md: 'center' },
                  order: { xs: 1, md: 2 },
                  flexGrow: 1,
                }}
              >
                <Typography
                  variant="h5"
                  component="p"
                  sx={{
                    color: footerText,
                    fontWeight: 800,
                    letterSpacing: '1px',
                    mb: 1,
                    textShadow: '0 0 10px rgba(255,255,255,0.1)',
                  }}
                >
                  UniClub
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: footerText,
                    opacity: 0.8,
                    fontSize: '0.9rem',
                    fontWeight: 400,
                  }}
                >
                  Yalova Üniversitesi Kulüp Yönetim Sistemi © 2025
                </Typography>
              </Box>

              {/* KOLON 3: GELİŞTİRENLER */}
              <Box 
                sx={{ 
                  flexShrink: 0, 
                  order: { xs: 3, md: 3 }, 
                  textAlign: { xs: 'center', md: 'right' } 
                }}
              >
                <Typography
                  variant="caption"
                  component="p"
                  sx={{
                    color: yalovaLightBlue,
                    fontSize: '0.9rem',
                    opacity: 0.95,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                    gap: 1,
                    fontWeight: 600,
                  }}
                >
                  <CodeIcon sx={{ color: yalovaRed, fontSize: '1.2rem' }} />
                  Geliştirenler:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: yalovaLightBlue,
                    fontSize: '1rem',
                    fontWeight: 700,
                    mt: 0.5,
                  }}
                >
                  Muhammed Sosun & Muhammed Eren Şancı
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}