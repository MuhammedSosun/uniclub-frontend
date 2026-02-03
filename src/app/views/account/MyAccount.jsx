import {
  Box,
  Card,
  Grid,
  CircularProgress,
  Stack,
  Avatar,
  Typography,
  Chip,
  Divider,
  Button,
  Alert,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// İkonlar
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import XIcon from "@mui/icons-material/X";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium"; // Sertifikalar için
import PsychologyIcon from "@mui/icons-material/Psychology"; // İlgi alanları için

// Modüllerimiz
import { useProfile } from "./hooks/useProfile";
import SectionTitle from "./components/SectionTitle";
import InfoBox from "./components/InfoBox";
import ChipGroup from "./components/ChipGroup";

export default function MyAccount() {
  const navigate = useNavigate();
  const { initialValues: profile, loading, error } = useProfile();

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  if (!profile) return null;

  return (
    <Box p={4} sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* SOL PANEL: KİŞİSEL ÖZET */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
            }}
          >
            <Avatar
              src={profile.profilePhotoPath}
              sx={{ width: 140, height: 140, mx: "auto", mb: 2, boxShadow: 3 }}
            >
              {!profile.profilePhotoPath && <PersonIcon sx={{ fontSize: 80 }} />}
            </Avatar>
            <Typography variant="h5" fontWeight={700}>
              {profile.name} {profile.surname}
            </Typography>

            {profile.canCreateEvent && (
              <Chip
                label="Kulüp Yöneticisi"
                color="warning"
                size="small"
                sx={{ mt: 1, fontWeight: "bold" }}
              />
            )}

            <Divider sx={{ my: 3 }} />

            <Stack spacing={1.5} alignItems="flex-start">
              <SocialItem
                icon={<LinkedInIcon fontSize="small" />}
                label="LinkedIn"
                value={profile.linkedIn}
              />
              <SocialItem
                icon={<GitHubIcon fontSize="small" />}
                label="GitHub"
                value={profile.github}
              />
              <SocialItem icon={<XIcon fontSize="small" />} label="X" value={profile.xAccount} />
              <SocialItem
                icon={<LanguageIcon fontSize="small" />}
                label="Web"
                value={profile.websiteUrl}
              />
            </Stack>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 4, borderRadius: 2 }}
              onClick={() => navigate("/profile/edit")}
            >
              Profili Düzenle
            </Button>
          </Card>
        </Grid>

        {/* SAĞ PANEL: DETAYLI BİLGİLER */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* 1. AKADEMİK & İLETİŞİM */}
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <SectionTitle icon={<SchoolIcon color="primary" />} title="Akademik ve İletişim" />
              <Grid container spacing={3}>
                <InfoBox label="Üniversite" value={profile.university} />
                <InfoBox label="Fakülte" value={profile.faculty} />
                <InfoBox label="Bölüm" value={profile.department} />
                <InfoBox
                  label="E-Posta"
                  value={profile.email}
                  icon={<EmailIcon fontSize="inherit" />}
                />
                <InfoBox
                  label="Telefon"
                  value={profile.phone}
                  icon={<LocalPhoneIcon fontSize="inherit" />}
                />
              </Grid>
            </Card>

            {/* 2. HAKKIMDA (BİYOGRAFİ) */}
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <SectionTitle icon={<PersonIcon color="primary" />} title="Hakkımda" />
              <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.8 }}>
                {profile.about || "Henüz bir açıklama eklenmemiş."}
              </Typography>
            </Card>

            {/* 3. YETENEKLER, SERTİFİKALAR VE DİLLER */}
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <SectionTitle
                icon={<WorkspacePremiumIcon color="primary" />}
                title="Yetkinlikler ve Başarılar"
              />
              <Stack spacing={2}>
                <ChipGroup title="Yetenekler" items={profile.skills} color="success" />
                <ChipGroup title="Sertifikalar" items={profile.certificates} color="warning" />
                <ChipGroup title="Bildiği Diller" items={profile.languages} color="secondary" />
                <ChipGroup title="Projeler" items={profile.projects} color="info" />
              </Stack>
            </Card>

            {/* 4. KULÜPLER VE İLGİ ALANLARI */}
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <SectionTitle icon={<GroupsIcon color="primary" />} title="Sosyal ve İlgi Alanları" />
              <Stack spacing={2}>
                <ChipGroup title="Üye Olunan Kulüpler" items={profile.clubNames} color="primary" />
                <ChipGroup title="İlgi Alanları" items={profile.interests} color="default" />
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

// Yardımcı Sosyal Medya Bileşeni
function SocialItem({ icon, label, value }) {
  if (!value) return null;
  return (
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Typography variant="body2" fontWeight={600}>
        {label}:
      </Typography>
      <Link href={value} target="_blank" variant="body2" sx={{ textDecoration: "none" }}>
        Bağlantı
      </Link>
    </Box>
  );
}
