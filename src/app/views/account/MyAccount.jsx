import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Avatar,
  Chip,
  Link, // Link bileşenini kullanmak için eklendi
  Paper // Bölüm başlıkları için eklendi
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X"; // X/Twitter için

import memberService from "app/services/memberService";

// ---------------- ANA BİLEŞEN ----------------
export default function MyAccount() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH PROFILE ---------------- (İŞ MANTIĞI KORUNDU)
  useEffect(() => {
    memberService
      .getMyProfile()
      .then((res) => {
        // RootEntity yapısı varsa payload içinden al
        const data = res?.payload ?? res;
        setProfile(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---------------- LOADING ---------------- (İŞ MANTIĞI KORUNDU)
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  // Profil durumuna göre dinamik renk ve etiket
  const statusColor =
    profile.status === "APPROVED"
      ? "success"
      : profile.status === "INCOMPLETE"
        ? "warning"
        : "error";
  const statusLabel =
    profile.status === "APPROVED"
      ? "Onaylandı"
      : profile.status === "INCOMPLETE"
        ? "Eksik Bilgi"
        : profile.status;

  return (
    // UniClub Dashboard genişliğine uygun merkezleme ve arkaplan
    <Box px={2} py={4} sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Card
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: { xs: 3, sm: 5 },
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // Hafif gölgelendirme
          borderRadius: 2
        }}
      >
        {/* HEADER: KİŞİSEL BİLGİLER */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={3}
          mb={4}
        >
          <Avatar
            alt={`${profile.name} ${profile.surname}`}
            src={profile.profilePhotoPath} // Eğer varsa fotoğraf yolu kullanılmalı
            sx={{ width: 96, height: 96, bgcolor: "primary.light" }} // Daha büyük avatar
          >
            {!profile.profilePhotoPath && <PersonIcon sx={{ fontSize: 50 }} />}
          </Avatar>

          <Box>
            <Typography variant="h4" fontWeight={600} color="text.primary" mb={0.5}>
              {profile.name} {profile.surname}
            </Typography>

            <Typography variant="h6" color="text.secondary" mb={1}>
              {profile.department} / {profile.faculty}
            </Typography>

            <Chip
              label={`Durum: ${statusLabel}`}
              size="medium"
              color={statusColor}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* BÖLÜM 1: AKADEMİK VE İLETİŞİM BİLGİLERİ */}
        <SectionHeader title="Akademik ve İletişim Bilgileri" />
        <Grid container spacing={4}>
          {/* Info bileşenleri artık icon alabilir */}
          <Info label="Üniversite" value={profile.university} icon={LanguageIcon} />
          <Info label="Fakülte/Bölüm" value={`${profile.faculty}, ${profile.department}`} />
          <Info label="Sınıf" value={profile.level} />
          <Info label="Yaş" value={profile.age} />
          <Info label="Öğrenci Numarası" value={profile.studentNumber} />
          <Info label="Telefon Numarası" value={profile.phone} />
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* BÖLÜM 2: HAKKIMDA */}
        <SectionHeader title="Hakkımda" />
        <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.7, mb: 0 }}>
          {profile.about || "Henüz bir açıklama eklenmemiş."}
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* BÖLÜM 3: YETENEKLER VE LİSTELER */}
        <SectionHeader title="Yetenekler ve Bilgiler" />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Section title="Yetenekler" items={profile.skills} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Section title="İlgi Alanları" items={profile.interests} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Section title="Sertifikalar" items={profile.certificates} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Section title="Bildiği Diller" items={profile.languages} />
          </Grid>
          <Grid item xs={12}>
            <Section title="Projeler" items={profile.projects} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* BÖLÜM 4: SOSYAL MEDYA LİNKLERİ */}
        <SectionHeader title="Sosyal Medya ve Linkler" />
        <Grid container spacing={4}>
          <Info label="LinkedIn" value={profile.linkedIn} link icon={LinkedInIcon} />
          <Info label="GitHub" value={profile.github} link icon={GitHubIcon} />
          <Info label="Website/Portfolyo" value={profile.websiteUrl} link icon={LanguageIcon} />
          <Info label="Instagram" value={profile.instagram} link icon={InstagramIcon} />
          <Info label="X (Twitter)" value={profile.xAccount} link icon={XIcon} />
        </Grid>

        {/* ACTION */}
        <Box display="flex" justifyContent="flex-end" mt={5}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/profile/edit")}
          >
            Profilimi Düzenle
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

// ---------------- YARDIMCI BİLEŞENLER (UniClub Stiline Tamamen Uygun) ----------------

// Özel Bölüm Başlığı Bileşeni (UniClub'daki Kart stiline benzer)
const SectionHeader = ({ title }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      mb: 3,
      backgroundColor: "#e3f2fd", // Açık mavi (UniClub primary.light)
      borderLeft: "4px solid #1976d2", // Mavi vurgu
      borderRadius: 1
    }}
  >
    <Typography variant="h6" fontWeight={500} color="#1976d2">
      {title}
    </Typography>
  </Paper>
);

// Bilgi Alanı Bileşeni
function Info({ label, value, link, icon: IconComponent }) {
  if (!value) return null;

  // Link için uygun URL formatlama (eğer link ise ve http/https içermiyorsa ekle)
  const formattedValue = link && !value.includes("http") ? `https://${value}` : value;

  return (
    <Grid item xs={12} sm={6}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={500}
        display="block"
        mb={0.2}
      >
        {label}
      </Typography>

      <Box display="flex" alignItems="center" gap={1}>
        {IconComponent && <IconComponent sx={{ fontSize: 18, color: "text.secondary" }} />}

        {link ? (
          <Link
            variant="body1" // body2 yerine body1, daha okunaklı
            href={formattedValue}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none", color: "primary.main", fontWeight: 500 }}
          >
            {value}
          </Link>
        ) : (
          <Typography variant="body1" fontWeight={500}>
            {value}
          </Typography>
        )}
      </Box>
    </Grid>
  );
}

// Liste Görüntüleme Bileşeni (Chip'ler daha şık hale getirildi)
function Section({ title, items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <Box mb={3}>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        {title}
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1}>
        {items.map((item, i) => (
          <Chip
            key={i}
            label={item}
            color="primary"
            variant="outlined" // Beyaz kart üzerinde daha temiz durur
            size="medium"
            sx={{ fontWeight: 500 }}
          />
        ))}
      </Box>
    </Box>
  );
}
