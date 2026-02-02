import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import membershipService from "../../services/membershipsService";
import { SimpleCard } from "app/components";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";

const ClubMembers = () => {
  // useParams tüm parametreleri obje olarak döndürür.
  const params = useParams();
  const navigate = useNavigate();

  // Route'da :id mi yoksa :clubId mi kullandığını bilmediğimiz için ikisini de kontrol ediyoruz.
  // Hangisi doluysa onu 'clubId' olarak alacağız.
  const clubId = params.id || params.clubId;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("URL Parametreleri:", params); // Konsola bak: { id: "..." } mi geliyor?
    console.log("Seçilen Club ID:", clubId);

    if (clubId) {
      loadApprovedMembers();
    } else {
      console.error("ID bulunamadı! Route tanımını kontrol et.");
    }
  }, [clubId]); // id yerine clubId'yi izle

  const loadApprovedMembers = async () => {
    try {
      setLoading(true);
      // Servise doğru ID'yi gönderiyoruz
      const res = await membershipService.getApprovedMembers(clubId);
      const memberList = res?.data?.data || res?.payload || [];
      setMembers(memberList);
    } catch (err) {
      console.error("Üyeler yüklenemedi", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleChip = (role) => {
    let color = "default";
    let label = role;
    if (role === "PRESIDENT") {
      color = "error";
      label = "Başkan";
    } else if (role === "VICE_PRESIDENT") {
      color = "warning";
      label = "Başkan Yrd.";
    } else if (role === "MEMBER") {
      color = "primary";
      label = "Üye";
    }
    return <Chip label={label} color={color} size="small" variant="outlined" />;
  };

  return (
    <Box margin="24px">
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "white", boxShadow: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Onaylı Kulüp Üyeleri
        </Typography>
      </Box>

      <SimpleCard title="Üye Listesi">
        {loading ? (
          <Box display="flex" justifyContent="center" p={5}>
            <CircularProgress />
          </Box>
        ) : !clubId ? (
          <Box color="error.main" p={2}>
            HATA: URL'den Kulüp ID alınamadı.
          </Box>
        ) : members.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Typography color="text.secondary">Henüz onaylı üye yok.</Typography>
          </Box>
        ) : (
          <Box overflow="auto">
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell width={80}>Profil</TableCell>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>Öğrenci No</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell align="right">Katılım</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((m, index) => (
                  <TableRow key={m.memberId || index} hover>
                    <TableCell>
                      <Avatar sx={{ bgcolor: "primary.light", width: 36, height: 36 }}>
                        {m.name ? m.name[0] : <PersonIcon />}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="500">
                        {m.name} {m.surname}
                      </Typography>
                    </TableCell>
                    <TableCell>{m.studentNumber}</TableCell>
                    <TableCell>{getRoleChip(m.role)}</TableCell>
                    <TableCell align="right">
                      {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString("tr-TR") : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </SimpleCard>
    </Box>
  );
};

export default ClubMembers;
