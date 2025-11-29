import { useEffect, useState } from "react";
import {
  Card,
  Box,
  Grid,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import eventService from "app/services/eventService";

// CARD STYLE
const ClubCard = styled(Card)(({ theme }) => ({
  padding: "16px 22px",
  borderRadius: 14,
  boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
  transition: "all .25s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0px 6px 22px rgba(0,0,0,0.12)",
  },
}));

// Badge style
const Badge = styled("div")(({ theme }) => ({
  background: theme.palette.primary.main,
  color: "white",
  padding: "4px 10px",
  fontSize: 12,
  borderRadius: 8,
  fontWeight: 600,
  display: "inline-block",
  whiteSpace: "nowrap",
}));

export default function RowCards() {
  const [clubs, setClubs] = useState([]);

  const loadTopClubs = async () => {
    try {
      const res = await eventService.getTopActiveClubsLast3Months();
      setClubs(res?.payload ?? []);
    } catch (err) {
      console.error("TOP CLUBS ERROR:", err);
    }
  };

  useEffect(() => {
    loadTopClubs();
  }, []);

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {clubs.map((club, i) => (
        <Grid item xs={12} key={i}>
          <ClubCard>
            <Grid container alignItems="center">
              
              {/* LEFT SIDE */}
              <Grid item xs={8} sm={9}>
                <Box display="flex" alignItems="center" gap={2}>
                  
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 46,
                      height: 46,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {club.clubName.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {club.clubName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Son 3 ayda en aktif kulüplerden biri
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* RIGHT SIDE */}
              <Grid
                item
                xs={4}
                sm={3}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
              >
                <Badge>
                  {club.eventCount} etkinlik
                </Badge>

                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            </Grid>
          </ClubCard>
        </Grid>
      ))}
    </Grid>
  );
}
