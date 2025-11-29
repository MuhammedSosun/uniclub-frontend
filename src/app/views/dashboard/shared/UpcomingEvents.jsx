import { Card, Typography } from "@mui/material";

export default function UpcomingEvents() {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6">Yaklaşan Etkinlikler</Typography>
      <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
        (Etkinlik listesi yakında eklenecek)
      </Typography>
    </Card>
  );
}
