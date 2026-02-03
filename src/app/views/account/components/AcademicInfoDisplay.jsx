import { Grid, Typography, Box } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

const AcademicInfoDisplay = ({ profile }) => (
  <Box>
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      <SchoolIcon color="primary" />
      <Typography variant="h6" fontWeight={700}>
        Akademik Bilgiler
      </Typography>
    </Box>
    <Grid container spacing={3}>
      <InfoItem label="Üniversite" value={profile.university} />
      <InfoItem label="Fakülte" value={profile.faculty} />
      <InfoItem label="Bölüm" value={profile.department} />
      <InfoItem label="Sınıf" value={`${profile.level}. Sınıf`} />
    </Grid>
  </Box>
);

const InfoItem = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="caption" color="text.secondary" fontWeight={600}>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value || "Belirtilmemiş"}
    </Typography>
  </Grid>
);

export default AcademicInfoDisplay;
