import { Box, Typography } from "@mui/material";
export default function SectionTitle({ icon, title }) {
  return (
    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
      <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
      <Typography variant="h6" fontWeight={700} color="text.primary">
        {title}
      </Typography>
    </Box>
  );
}
