import { useEffect, useState } from "react";
import { SimpleCard } from "app/components";
import { useParams, useNavigate } from "react-router-dom";
import clubService from "app/services/clubService";
import { 
  Button, Divider, Stack, Typography, Box, Chip, Card, CardContent 
} from "@mui/material";
import { toast } from "react-toastify";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (loading) return <h3>Yükleniyor...</h3>;
  if (!club) return <h3>Kulüp bulunamadı.</h3>;

  return (
    <SimpleCard title={`${club.clubName} | Kulüp Detay`}>

      {/* Ana Container */}
      <Stack spacing={3}>

        {/* Kulüp Bilgileri Kartı */}
        <Card elevation={1}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <InfoIcon color="primary" />
              <Typography variant="h6" ml={1}>Kulüp Bilgileri</Typography>
            </Box>

            <Stack spacing={1.5}>
              <Row label="Kulüp Adı" value={club.clubName} />
              <Row label="Kısa Ad" value={club.shortName} />
              <Row label="Email" value={club.email} />
              <Row label="Instagram" value={club.instagram} />
              <Row label="Telefon" value={club.phone} />

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Durum
                </Typography>
                <Chip 
                  label={club.status}
                  color={club.status === "Active" ? "success" : "default"}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Row 
                label="Kuruluş Tarihi" 
                value={
                  club.foundationDate 
                    ? club.foundationDate 
                    : "-"
                } 
                icon={<CalendarMonthIcon fontSize="small" />} 
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Başkan Bilgileri Kartı */}
        <Card elevation={1}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon color="primary" />
              <Typography variant="h6" ml={1}>Kulüp Başkanı</Typography>
            </Box>

            <Stack spacing={1.5}>
              <Row 
                label="Başkan ID" 
                value={club.presidentId ?? "Atanmamış"} 
              />

              <Row 
                label="Başkan Kullanıcı Adı" 
                value={club.presidentUsername ?? "—"} 
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Butonlar */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate(`/clubs/update/${club.id}`)}
          >
            Düzenle
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/clubs")}
          >
            Listeye Dön
          </Button>
        </Box>

      </Stack>
    </SimpleCard>
  );
}

/* Küçük satır bileşeni - temiz görüntü için */
function Row({ label, value, icon }) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {icon && <span style={{ marginRight: 6, verticalAlign: "middle" }}>{icon}</span>}
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}
