import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

// Ana dış kart
const CardRoot = styled(Card)(({ theme }) => ({
  marginBottom: "24px",
  padding: "24px !important",
  borderRadius: 20,
  boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
  [theme.breakpoints.down("sm")]: { padding: "16px !important" },
}));

// İç kısım
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  position: "relative",
  padding: "28px !important",
  borderRadius: 18,
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.15
  )}, ${alpha(theme.palette.primary.main, 0.05)})`,
  transition: "all .25s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 6px 22px rgba(0,0,0,0.12)",
  },
}));

export default function UniInfoCard() {
  return (
    <CardRoot>
      <StyledCard elevation={0}>
        {/* Logo */}
        <Box
          component="img"
          src="/assets/images/unilogo.png" // <-- BURAYA AMBLEMİ KOY
          alt="Yalova University"
          sx={{
            width: 110,
            mb: 2,
            opacity: 0.95,
            userSelect: "none",
          }}
        />

        {/* Başlık */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: "primary.main", mb: 1 }}
        >
          Yalova Üniversitesi Kulüp Sistemi
        </Typography>

        {/* Açıklama */}
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 15,
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          Üniversite kulüplerini kolayca yönetin, etkinlikleri takip edin
          ve kampüs yaşamını dijitalleştirin.
        </Typography>

        {/* Buton */}
        <Button
  size="large"
  color="primary"
  variant="contained"
  sx={{
    textTransform: "none",
    fontWeight: 600,
    px: 4,
    borderRadius: 10,
  }}
  onClick={() => window.open("https://www.yalova.edu.tr/", "_blank")}
>
  Yalova Üniversitesi
</Button>

      </StyledCard>
    </CardRoot>
  );
}
