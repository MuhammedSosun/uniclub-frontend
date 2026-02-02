import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  Chip,
  Divider,
  Button,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import memberService from "app/services/memberService";
import { toast } from "react-toastify";

// İkonlar
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import CodeIcon from "@mui/icons-material/Code";
// 👇 Eksik olanları buraya yukarıya taşıdım
import GroupIcon from "@mui/icons-material/Group";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

// Özel Stil Bileşenleri
const ProfileCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  height: "100%"
}));

const InfoCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%"
}));

const SectionTitle = ({ title, icon }) => (
  <Box display="flex" alignItems="center" gap={1} mb={2}>
    {icon}
    <Typography variant="h6" fontWeight="bold" color="text.primary">
      {title}
    </Typography>
  </Box>
);

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await memberService.getById(id);
        // Backend yapına göre payload kontrolü
        setMember(res.data?.payload || res.payload);
      } catch (error) {
        console.error("Üye detayı alınamadı", error);
        toast.error("Üye bilgileri yüklenemedi!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMember();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!member) return null;

  return (
    <Box p={3}>
      {/* GERİ BUTONU */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: "none", color: "text.secondary" }}
      >
        Listeye Dön
      </Button>

      <Grid container spacing={3}>
        {/* SOL KOLON: PROFİL ÖZETİ */}
        <Grid item xs={12} md={4} lg={3}>
          <ProfileCard elevation={3}>
            <Avatar
              src={member.profilePhotoPath}
              alt={member.name}
              sx={{ width: 120, height: 120, mb: 2, fontSize: "3rem", bgcolor: "#1A2038" }}
            >
              {member.name?.charAt(0)}
            </Avatar>

            <Typography variant="h5" fontWeight="bold">
              {member.name} {member.surname}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {member.department}
            </Typography>

            <Chip
              label={member.status || "MEMBER"}
              color={member.status === "ACTIVE" ? "success" : "default"}
              size="small"
              sx={{ mt: 1, mb: 3 }}
            />

            <Divider flexItem sx={{ mb: 2 }} />

            {/* İLETİŞİM BİLGİLERİ */}
            <Stack spacing={2} width="100%">
              {member.email && (
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon color="action" fontSize="small" />
                  <Typography variant="body2">{member.email}</Typography>
                </Box>
              )}
              {member.phone && (
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneIcon color="action" fontSize="small" />
                  <Typography variant="body2">{member.phone}</Typography>
                </Box>
              )}
              {member.studentNumber && (
                <Box display="flex" alignItems="center" gap={1}>
                  <SchoolIcon color="action" fontSize="small" />
                  <Typography variant="body2">{member.studentNumber}</Typography>
                </Box>
              )}
            </Stack>

            {/* SOSYAL MEDYA İKONLARI */}
            <Box mt={3} display="flex" gap={1} justifyContent="center">
              {member.instagram && (
                <IconButton href={member.instagram} target="_blank" color="error">
                  <InstagramIcon />
                </IconButton>
              )}
              {member.linkedIn && (
                <IconButton href={member.linkedIn} target="_blank" color="primary">
                  <LinkedInIcon />
                </IconButton>
              )}
              {member.github && (
                <IconButton href={member.github} target="_blank" sx={{ color: "#333" }}>
                  <GitHubIcon />
                </IconButton>
              )}
              {member.websiteUrl && (
                <IconButton href={member.websiteUrl} target="_blank" color="info">
                  <LanguageIcon />
                </IconButton>
              )}
            </Box>
          </ProfileCard>
        </Grid>

        {/* SAĞ KOLON: DETAYLAR */}
        <Grid item xs={12} md={8} lg={9}>
          <Grid container spacing={3}>
            {/* HAKKINDA & AKADEMİK */}
            <Grid item xs={12}>
              <InfoCard elevation={3}>
                <SectionTitle
                  title="Hakkında & Akademik Bilgiler"
                  icon={<SchoolIcon color="primary" />}
                />
                <Typography paragraph color="text.secondary">
                  {member.about || "Kullanıcı henüz kendisi hakkında bir bilgi girmedi."}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Üniversite
                    </Typography>
                    <Typography variant="body2">{member.university || "Belirtilmemiş"}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fakülte
                    </Typography>
                    <Typography variant="body2">{member.faculty || "Belirtilmemiş"}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Bölüm
                    </Typography>
                    <Typography variant="body2">{member.department || "Belirtilmemiş"}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Sınıf/Seviye
                    </Typography>
                    <Typography variant="body2">{member.level || "Belirtilmemiş"}</Typography>
                  </Grid>
                </Grid>
              </InfoCard>
            </Grid>

            {/* YETENEKLER & İLGİ ALANLARI */}
            <Grid item xs={12} md={6}>
              <InfoCard elevation={3}>
                <SectionTitle title="Yetenekler" icon={<CodeIcon color="secondary" />} />
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {member.skills && member.skills.length > 0 ? (
                    member.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Yetenek girilmemiş.
                    </Typography>
                  )}
                </Box>

                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    İlgi Alanları
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {member.interests && member.interests.length > 0 ? (
                      member.interests.map((int, index) => (
                        <Chip key={index} label={int} size="small" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </Box>
                </Box>
              </InfoCard>
            </Grid>

            {/* KULÜPLER & ETKİNLİKLER */}
            <Grid item xs={12} md={6}>
              <InfoCard elevation={3}>
                <SectionTitle title="Kulüp Üyelikleri" icon={<GroupIcon color="warning" />} />
                <Stack spacing={1} mb={3}>
                  {member.clubNames && member.clubNames.length > 0 ? (
                    member.clubNames.map((club, idx) => (
                      <Box key={idx} display="flex" alignItems="center" gap={1}>
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#ed6c02"
                          }}
                        ></div>
                        <Typography variant="body2">{club}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Henüz bir kulübe üye değil.
                    </Typography>
                  )}
                </Stack>

                <SectionTitle
                  title="Katıldığı Etkinlikler"
                  icon={<EventAvailableIcon color="success" />}
                />
                <Stack spacing={1}>
                  {member.participatedEventTitles && member.participatedEventTitles.length > 0 ? (
                    member.participatedEventTitles.map((evt, idx) => (
                      <Box key={idx} display="flex" alignItems="center" gap={1}>
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#2e7d32"
                          }}
                        ></div>
                        <Typography variant="body2">{evt}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Etkinlik kaydı yok.
                    </Typography>
                  )}
                </Stack>
              </InfoCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
