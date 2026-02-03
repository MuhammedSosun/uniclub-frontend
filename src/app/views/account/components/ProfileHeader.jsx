import { Box, Typography } from "@mui/material";

const ProfileHeader = ({ memberStatus }) => (
  <Box sx={{ p: 4, bgcolor: "primary.main", color: "white" }}>
    <Typography variant="h4" fontWeight={700}>
      {memberStatus === "INCOMPLETE" ? "Profilini Tamamla" : "Profil Ayarları"}
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.9 }}>
      Akademik ve kişisel bilgilerinizi buradan güncelleyebilirsiniz.
    </Typography>
  </Box>
);

export default ProfileHeader;
