import { useEffect, useState } from "react";
import {
  Card,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Button,
  TableContainer,
  CircularProgress,
  Chip,
  Stack
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SearchIcon from "@mui/icons-material/Search";

// --- GERÇEK BACKEND SERVİSİ ---
import eventService from "app/services/eventService";

// --- TEMA RENKLERİ ---
const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

// --- STYLED COMPONENTS ---
const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: primaryDark,
  "& .MuiTableCell-root": {
    color: yalovaRed,
    fontWeight: 700,
    fontSize: "0.9rem",
    borderBottom: `2px solid ${yalovaRed}`,
    textTransform: "uppercase",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.3s",
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "rgba(176, 0, 32, 0.1)",
  },
}));

// --- ETKİNLİK DURUMU RENKLERİ ---
const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "ONAYLANDI":
      return { label: "ONAYLANDI", bgColor: "#C8E6C9" };
    case "BEKLEMEDE":
      return { label: "BEKLEMEDE", bgColor: "#FFECB3" };
    case "İPTAL EDİLDİ":
      return { label: "İPTAL EDİLDİ", bgColor: "#FFCDD2" };
    default:
      return { label: "BİLİNMİYOR", bgColor: "#f0f0f0" };
  }
};

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- İLK YÜKLEME ---
  useEffect(() => {
    loadEvents();
  }, []);

  // --- EVENT GETİRME ---
  const loadEvents = async (search = "") => {
    setLoading(true);
    try {
      const response = search
        ? await eventService.searchEvents(search)
        : await eventService.getAllEvents();

      setEvents(response.payload ?? []);
    } catch (err) {
      toast.error("Etkinlikler yüklenirken hata oluştu!");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const v = e.target.value;
    setFilter(v);
    loadEvents(v);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 6 }}>
      

      {/* --- ÜST HEADER KISMI --- */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: primaryDark, display: "flex", alignItems: "center" }}
        >
          <EventNoteIcon sx={{ mr: 1, color: yalovaRed }} />
          Etkinlik Yönetimi
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: yalovaRed,
            "&:hover": { backgroundColor: "#8A0019" },
            fontWeight: 700,
            textTransform: "none",
          }}
          onClick={() => navigate("/events/create")}
        >
          Etkinlik Oluştur
        </Button>
      </Stack>


      {/* ARAMA ALANI */}
      <Box mb={3}>
        <TextField
          label="Etkinlik Adı ile Ara"
          variant="outlined"
          size="small"
          value={filter}
          onChange={handleFilterChange}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>


      {/* TABLO */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <TableCell>Etkinlik Adı</TableCell>
              <TableCell>Tarih & Saat</TableCell>
              <TableCell>Konum</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Oluşturan</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {loading ? (
              <StyledTableRow>
                <TableCell colSpan={6} align="center">
                  <Box py={3}>
                    <CircularProgress size={30} sx={{ color: yalovaRed }} />
                  </Box>
                </TableCell>
              </StyledTableRow>
            ) : events.length > 0 ? (
              events.map((e) => {
                const statusInfo = getStatusColor(e.status);
                return (
                  <StyledTableRow key={e.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{e.title}</TableCell>
                    <TableCell>{formatDateTime(e.eventDate)}</TableCell>
                    <TableCell>{e.location || "—"}</TableCell>

                    <TableCell>
                      <Chip
                        label={statusInfo.label}
                        size="small"
                        sx={{
                          backgroundColor: statusInfo.bgColor,
                          color: primaryDark,
                          fontWeight: 700,
                          minWidth: 100,
                        }}
                      />
                    </TableCell>

                    <TableCell>{e.createdBy || "—"}</TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: yalovaRed,
                          color: yalovaRed,
                          "&:hover": {
                            backgroundColor: "rgba(176, 0, 32, 0.05)",
                            borderColor: "#8a0019",
                          },
                        }}
                      >
                        Detay
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <TableCell colSpan={6} align="center">
                  <Typography py={3} color="text.secondary">
                    Henüz kayıtlı etkinlik bulunmuyor.
                  </Typography>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
