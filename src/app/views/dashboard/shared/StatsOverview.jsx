import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ArrowRightAlt from "@mui/icons-material/ArrowRightAlt";

import { Small } from "app/components/Typography";

import clubService from "app/services/clubService";
import eventService from "app/services/eventService";
import { useEffect, useState } from "react";


// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": { opacity: 0.6, fontSize: "44px", color: theme.palette.primary.main }
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main
}));


// MAIN COMPONENT
// MAIN COMPONENT
export default function StatsOverview() {

  const [stats, setStats] = useState({
    totalClubs: 0,
    totalEvents: 0,
    eventsThisMonth: 0,
    pendingClubApprovals: 0,
    pendingEventApprovals: 0,
    totalUsers: 0,
    activeClubCount: 0,
    last30DaysAttendance: 0,
  });

  const loadStats = async () => {
  try {

    const [clubsRes, eventsRes] = await Promise.all([
      clubService.totalClubs(),
      eventService.totalEvents(),
  
    ]);

  

    setStats(prev => ({
      ...prev,
      totalClubs: clubsRes?.payload ?? 0,
      totalEvents: eventsRes?.payload ?? 0
    }));

  } catch (err) {
    console.error("Dashboard stats error:", err);
  }
};

  useEffect(() => {
    loadStats();
  }, []);

  // Backend’ten doldurulacak değerler
  const cardList = [
    { name: "Toplam Kulüp Sayısı", amount: stats.totalClubs, Icon: GroupsIcon },
    { name: "Toplam Etkinlik Sayısı", amount: stats.totalEvents, Icon: EventIcon },
    { name: "Bu Ayki Etkinlik Sayısı", amount: stats.eventsThisMonth, Icon: CalendarMonthIcon },
    { name: "Bekleyen Kulüp Onayları", amount: stats.pendingClubApprovals, Icon: PendingActionsIcon },
    { name: "Bekleyen Etkinlik Onayları", amount: stats.pendingEventApprovals, Icon: PendingActionsIcon },
    { name: "Toplam Kullanıcı Sayısı", amount: stats.totalUsers, Icon: GroupsIcon },
    { name: "En Aktif Kulüpler (İlk 5)", amount: stats.activeClubCount, Icon: GroupsIcon },
    { name: "Son 30 Gün Toplam Katılım", amount: stats.last30DaysAttendance, Icon: GroupsIcon }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name }) => (
        <Grid size={{ md: 6, xs: 12 }} key={name}>
          <StyledCard elevation={6}>
            
            <ContentBox>
              <Icon className="icon" />
              <Box ml="12px">
                <Small>{name}</Small>
                <Heading>{amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="Detayları Gör" placement="top">
              <IconButton>
                <ArrowRightAlt />
              </IconButton>
            </Tooltip>

          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
