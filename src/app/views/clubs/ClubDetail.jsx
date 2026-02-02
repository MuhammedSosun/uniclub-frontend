import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clubService from "app/services/clubService";
import { SimpleCard } from "app/components";
import {
  Button,
  Typography,
  Box,
  Chip,
  Card,
  Grid,
  Avatar,
  Divider,
  Stack,
  IconButton,
  Tooltip
} from "@mui/material";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

// İkonlar
import GroupsIcon from "@mui/icons-material/Groups"; // Üyeler için
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import InstagramIcon from "@mui/icons-material/Instagram";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadClubDetail = async () => {
    try {
      setLoading(true);
      const response = await clubService.getClubById(id);
      setClub(response.payload);
    } catch (error) {
      console.error("Kulüp detayı alınamadı:", error);
      toast.error("Kulüp bilgisi yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubDetail();
  }, [id]);

  // Üyeleri listeleme sayfasına yönlendirecek fonksiyon (İleride burayı dolduracaksın)
  const handleViewMembers = () => {
    navigate(`/clubs/${id}/members`);
  };

  if (loading)
    return (
      <Box p={4}>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  if (!club)
    return (
      <Box p={4}>
        <Typography>Kulüp bulunamadı.</Typography>
      </Box>
    );

  return (
    <Box margin="24px">
      {/* --- ÜST BAŞLIK VE AKSİYONLAR --- */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate("/clubs")} sx={{ bgcolor: "white", boxShadow: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              {club.clubName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kulüp Detayları ve Yönetimi
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          {/* YENİ BUTON BURADA */}
          <Button
            variant="contained"
            color="info"
            startIcon={<GroupsIcon />}
            onClick={handleViewMembers}
            sx={{ color: "white" }}
          >
            Üyeleri Listele
          </Button>

          <Button
            variant="outlined"
            color="warning"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/clubs/update/${club.id}`)}
          >
            Düzenle
          </Button>
        </Box>
      </Box>

      {/* --- ANA İÇERİK GRID --- */}
      <Grid container spacing={3}>
        {/* SOL KOLON: GENEL BİLGİLER */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                bgcolor: theme.palette.primary.main,
                fontSize: "2rem"
              }}
            >
              {club.shortName ? club.shortName.substring(0, 2).toUpperCase() : "KB"}
            </Avatar>

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {club.shortName || club.clubName}
            </Typography>

            <Chip
              label={club.status === "ACTIVE" ? "Aktif Kulüp" : "Pasif"}
              color={club.status === "ACTIVE" ? "success" : "default"}
              variant="filled"
              sx={{ mb: 3 }}
            />

            <Divider sx={{ width: "100%", mb: 2 }} />

            <Box width="100%" display="flex" flexDirection="column" gap={2}>
              <InfoRow
                icon={<CalendarMonthIcon color="action" />}
                label="Kuruluş"
                value={club.foundationDate || "-"}
              />
              <InfoRow
                icon={<BusinessIcon color="action" />}
                label="Kategori"
                value="Genel" // Backend'den gelirse burayı değiştirirsin
              />
            </Box>
          </Card>
        </Grid>

        {/* SAĞ KOLON: İLETİŞİM VE YÖNETİM */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* İletişim Kartı */}
            <SimpleCard title="İletişim Bilgileri">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <ContactBox
                    icon={<EmailIcon color="primary" />}
                    title="Email Adresi"
                    value={club.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ContactBox
                    icon={<PhoneIcon color="primary" />}
                    title="Telefon"
                    value={club.phone}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ContactBox
                    icon={<InstagramIcon color="secondary" />}
                    title="Instagram"
                    value={club.instagram ? `@${club.instagram.replace("@", "")}` : "-"}
                  />
                </Grid>
              </Grid>
            </SimpleCard>

            {/* Başkan / Yönetim Kartı */}
            <SimpleCard title="Yönetim Bilgileri">
              <Box display="flex" alignItems="center" gap={2} p={1}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  <BadgeIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Kulüp Başkanı
                  </Typography>
                  <Typography variant="h6">{club.presidentUsername || "Atanmamış"}</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    ID: {club.presidentId || "-"}
                  </Typography>
                </Box>
              </Box>
            </SimpleCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

/* Yardımcı Alt Bileşenler - Kodun okunabilirliği için */

// Sol taraftaki küçük satırlar
function InfoRow({ icon, label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="body2" fontWeight="medium" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  );
}

// İletişim kutucukları
function ContactBox({ icon, title, value }) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #eee",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "0.3s",
        "&:hover": { bgcolor: "#f9f9f9", borderColor: "#ddd" }
      }}
    >
      {icon}
      <Box overflow="hidden">
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Tooltip title={value || ""}>
          <Typography
            variant="body1"
            fontWeight="500"
            noWrap // Uzun metinleri kesip ... koyar
          >
            {value || "-"}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
}
