import { Grid, Typography, Box } from "@mui/material";
export default function InfoBox({ label, value, icon }) {
  return (
    <Grid item xs={12} sm={6}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ textTransform: "uppercase" }}
      >
        {label}
      </Typography>
      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
        {icon && <Box sx={{ display: "flex", color: "primary.main" }}>{icon}</Box>}
        <Typography variant="body1" fontWeight={500}>
          {value || "Belirtilmemiş"}
        </Typography>
      </Box>
    </Grid>
  );
}
