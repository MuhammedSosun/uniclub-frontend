import { useEffect, useState } from "react";
import { Card, Box, Typography, Avatar } from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import EventIcon from "@mui/icons-material/Event";
import eventService from "app/services/eventService";

export default function TopMonthlyEvents() {
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    try {
      const res = await eventService.getTopEventsThisMonth();
      setEvents(res?.payload ?? []);
    } catch (err) {
      console.error("TOP MONTH EVENTS ERROR:", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <Card sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        📅 Bu Ayın En Çok Etkileşim Alan Etkinlikleri
      </Typography>

      {events.map((event, idx) => (
        <Box
          key={idx}
          sx={{
            p: 2,
            mb: 1.5,
            borderRadius: 2,
            background: "#f5f7fa",
            display: "flex",
            alignItems: "center",
            gap: 2,
            transition: "0.25s",
            "&:hover": {
              background: "#e8eef5",
              transform: "translateX(6px)",
            },
          }}
        >
          {/* Sol ikon */}
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <EventIcon />
          </Avatar>

          {/* Orta bilgi */}
          <Box flex={1}>
            <Typography fontWeight={600}>{event.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {event.location} •{" "}
              {new Date(event.eventDate).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Sağda etkileşim */}
          <Box display="flex" alignItems="center" gap={1}>
            <WhatshotIcon color="error" />
            <Typography fontWeight={700}>
              {event.participantCount} kişi
            </Typography>
          </Box>
        </Box>
      ))}
    </Card>
  );
}
