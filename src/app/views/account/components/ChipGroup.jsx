import { Box, Typography, Chip } from "@mui/material";
export default function ChipGroup({ title, items, color = "default" }) {
  if (!items || items.length === 0) return null;
  return (
    <Box mb={2}>
      <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.secondary">
        {title}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {items.map((item, i) => (
          <Chip
            key={i}
            label={item}
            size="small"
            color={color}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        ))}
      </Box>
    </Box>
  );
}
