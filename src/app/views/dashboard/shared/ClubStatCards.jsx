import { Card, Grid, Box, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import BlockIcon from "@mui/icons-material/Block";

export default function ClubStatCards({ clubs }) {

  const totalClubs = clubs.length;
  const activeClubs = clubs.filter(c => c.status === "Active").length;
  const suspendedClubs = clubs.filter(c => c.status === "Suspended").length;
  const terminatedClubs = clubs.filter(c => c.status === "Terminated").length;

  const cards = [
    {
      title: "Toplam Kulüp",
      value: totalClubs,
      icon: <GroupsIcon fontSize="large" color="primary" />,
      color: "#1976d2"
    },
    {
      title: "Aktif Kulüpler",
      value: activeClubs,
      icon: <CheckCircleIcon fontSize="large" color="success" />,
      color: "#2e7d32"
    },
    {
      title: "Askıya Alınan",
      value: suspendedClubs,
      icon: <PauseCircleFilledIcon fontSize="large" color="warning" />,
      color: "#ed6c02"
    },
    {
      title: "Silinen Kulüpler",
      value: terminatedClubs,
      icon: <BlockIcon fontSize="large" color="error" />,
      color: "#d32f2f"
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((item, index) => (
        <Grid key={index} size={{ md: 3, sm: 6, xs: 12 }}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderLeft: `5px solid ${item.color}`,
              boxShadow: 3
            }}
          >
            {item.icon}

            <Box>
              <Typography variant="h6" fontWeight="bold">
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.title}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
