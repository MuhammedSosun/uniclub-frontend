import { Card, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const CardContainer = styled(Card)(({ theme }) => ({
  padding: "1.5rem",
  borderRadius: "12px",
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  transition: "0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[8],
    transform: "translateY(-2px)"
  }
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: "1.8rem",
  fontWeight: 700,
  color: theme.palette.primary.main
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary
}));

export default function ClubStatCards2({ stats }) {
  // Default boş data
  const {
    totalClubs = 0,
    activeClubs = 0,
    suspendedClubs = 0,
    terminatedClubs = 0
  } = stats || {};

  const items = [
    { label: "Toplam Kulüp", value: totalClubs, color: "#1e88e5" },
    { label: "Aktif Kulüp", value: activeClubs, color: "#43a047" },
    { label: "Askıya Alınan", value: suspendedClubs, color: "#fb8c00" },
    { label: "Kapatılan", value: terminatedClubs, color: "#e53935" }
  ];

  return (
    <Grid container spacing={3} sx={{ my: 2 }}>
      {items.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <CardContainer>
            <Stack spacing={1}>
              <StatValue sx={{ color: item.color }}>{item.value}</StatValue>
              <StatLabel>{item.label}</StatLabel>
            </Stack>
          </CardContainer>
        </Grid>
      ))}
    </Grid>
  );
}
