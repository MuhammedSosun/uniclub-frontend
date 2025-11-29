import { useEffect, useState } from "react";
import { Card, Typography, Box, LinearProgress } from "@mui/material";
import clubService from "app/services/clubService";

export default function ClubMembersCampaigns() {
  const [clubs, setClubs] = useState([]);

  const loadClubs = async () => {
    try {
      const res = await clubService.getTopClubsByMembers();
      setClubs(res?.payload ?? []);
    } catch (err) {
      console.error("CLUB MEMBERS ERROR:", err);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  return (
    <Card sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        👥 En Çok Üyeye Sahip Kulüpler
      </Typography>

      {clubs.map((club, idx) => {
        const max = clubs[0]?.memberCount || 1;
        const percentage = (club.memberCount / max) * 100;

        return (
          <Box key={idx} mb={2}>
            <Typography fontWeight={600}>
              {club.clubName}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 5,
                my: 1,
              }}
            />

            <Typography variant="body2" color="text.secondary">
              {club.memberCount} üye
            </Typography>
          </Box>
        );
      })}
    </Card>
  );
}
