import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, useTheme, Container } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PublicIcon from "@mui/icons-material/Public";
import CodeIcon from "@mui/icons-material/Code";

// --- MOCK DEPENDENCIES ---
const topBarHeight = 64;
const yalovaRed = "#B00020";
const yalovaLightBlue = "#E3F2FD";
const footerBg = "#1f1f1f"; // Koyu Arka Plan

const mockTheme = createTheme({
  palette: { primary: { main: yalovaRed }, secondary: { main: yalovaLightBlue } },
  typography: { fontFamily: "Inter, sans-serif" }
});

const useSettings = () => ({
  settings: {
    footer: { theme: "dark" },
    themes: { dark: mockTheme }
  }
});
// ------------------------------------------------------------------------------------

export default function Footer() {
  const { settings } = useSettings();

  const customFooterTheme = createTheme({
    palette: {
      primary: { main: yalovaRed },
      secondary: { main: yalovaLightBlue },
      background: { default: footerBg }
    },
    typography: { fontFamily: "Inter, sans-serif" },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 15px rgba(176, 0, 32, 0.4)"
            }
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={customFooterTheme}>
      <AppBar
        position="static" // Bu, Footer'ın normal akışta kalmasını sağlar.
        elevation={0}
        sx={{
          zIndex: 96,
          background: footerBg,
          minHeight: 120, // Sabit bir minimum yükseklik verdim
          borderTop: `4px solid ${yalovaRed}`
        }}
      >
        {/* Dalgalı Ayırıcı KALDIRILDI. Artık sadece düz bir blok. */}

        <Container
          maxWidth="xl"
          sx={{
            height: "100%",
            py: { xs: 3, md: 4 }, // Dikey dolguyu azalttım, çakışmayı önlemek için.
            display: "flex",
            alignItems: "center"
          }}
        >
          <Toolbar
            disableGutters
            sx={{ minHeight: "unset", flexWrap: "wrap", p: 0, width: "100%" }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                gap: { xs: 2, md: 3 }
              }}
            >
              {/* KOLON 1: YALOVA ÜNİVERSİTESİ BUTONU */}
              <Box sx={{ flexShrink: 0, order: { xs: 2, md: 1 } }}>
                <Button
                  variant="contained"
                  startIcon={<PublicIcon />}
                  sx={{
                    background: yalovaRed,
                    color: yalovaLightBlue,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    borderRadius: 8,
                    px: 3,
                    py: 1.2,
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    "&:hover": { background: "#A0001D" }
                  }}
                  onClick={() => window.open("https://www.yalova.edu.tr/", "_blank")}
                >
                  Yalova Üniversitesi Resmi Sitesi
                </Button>
              </Box>

              {/* KOLON 2: MERKEZ METİN */}
              <Box sx={{ textAlign: "center", order: { xs: 1, md: 2 }, flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ color: yalovaLightBlue, fontWeight: 800, letterSpacing: "1px", mb: 0.5 }}
                >
                  UniClub
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: yalovaLightBlue, opacity: 0.8, fontSize: "0.85rem" }}
                >
                  Yalova Üniversitesi Kulüp Yönetim Sistemi © 2025
                </Typography>
              </Box>

              {/* KOLON 3: GELİŞTİRENLER */}
              <Box sx={{ flexShrink: 0, order: { xs: 3, md: 3 }, textAlign: "right" }}>
                <Typography
                  variant="caption"
                  component="p"
                  sx={{
                    color: yalovaLightBlue,
                    fontSize: "0.85rem",
                    opacity: 0.95,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-end" },
                    gap: 1,
                    fontWeight: 600
                  }}
                >
                  <CodeIcon sx={{ color: yalovaRed, fontSize: "1.2rem" }} />
                  Geliştirenler:
                  <Box component="b" sx={{ ml: 0.5 }}>
                    Muhammed Sosun & Muhammed Eren Şancı
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
