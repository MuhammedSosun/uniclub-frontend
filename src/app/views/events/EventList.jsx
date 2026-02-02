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
  Stack,
  TablePagination,
  Tooltip,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// İKONLAR
import AddIcon from "@mui/icons-material/Add";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddIcon from "@mui/icons-material/GroupAdd"; // Katıl İkonu
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Onaylı İkonu
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Beklemede İkonu
import CancelIcon from "@mui/icons-material/Cancel"; // Reddedildi İkonu
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"; // Yönetim İkonu

import eventService from "app/services/eventService";
import memberService from "app/services/memberService";

// 🔥 Yeni Modal Importu (Dosya yolunu kendi projene göre kontrol et)
import EventParticipantsDialog from "./EventParticipantsDialog";

const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

/* ---------------- STYLES ---------------- */

const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: primaryDark,
  "& .MuiTableCell-root": {
    color: yalovaRed,
    fontWeight: 700,
    fontSize: "0.9rem",
    borderBottom: `2px solid ${yalovaRed}`,
    textTransform: "uppercase"
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:hover": {
    backgroundColor: "rgba(176, 0, 32, 0.1)"
  }
}));

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
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  // Yetki ve Kullanıcı State'leri
  const [canCreate, setCanCreate] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Giriş yapan kullanıcı

  // 🔥 MODAL STATE'LERİ
  const [managerOpen, setManagerOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");

  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 5
  });

  const navigate = useNavigate();

  /* ---------- YETKİ KONTROLÜ ---------- */
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await memberService.getMyProfile();
        const user = response.data?.payload || response.payload;

        setCurrentUser(user); // Kullanıcıyı kaydet (Owner kontrolü için)

        if (user.canCreateEvent || user.role === "ADMIN") {
          setCanCreate(true);
        }
      } catch (error) {
        console.error("Yetki kontrolü yapılamadı", error);
      }
    };
    checkPermission();
  }, []);

  /* ---------- ETKİNLİKLERİ YÜKLE ---------- */
  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await eventService.getUpcomingEventsPaged({
        pageNumber: pagination.page,
        pageSize: pagination.pageSize,
        columnName: "eventDate",
        asc: true,
        filter
      });

      const data = response.data?.payload || response.payload;
      setEvents(data.content);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error(err);
      toast.error("Etkinlikler yüklenemedi");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [pagination, filter]);

  /* ---------- ETKİNLİĞE KATIL ---------- */
  const handleJoin = async (eventId) => {
    try {
      await eventService.joinEvent(eventId);
      toast.success("Katılım isteği gönderildi! Yönetici onayı bekleniyor.");
      loadEvents();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Katılım işlemi başarısız.";
      toast.error(errorMsg);
    }
  };

  /* ---------- YÖNETİM MODALINI AÇ ---------- */
  const handleOpenManager = (event) => {
    setSelectedEventId(event.id);
    setSelectedEventTitle(event.title);
    setManagerOpen(true);
  };

  const formatDateTime = (date) => new Date(date).toLocaleString("tr-TR");

  /* ---------------- RENDER ---------------- */

  return (
    <Card sx={{ p: 4, borderRadius: 2, boxShadow: 6 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700} sx={{ color: primaryDark }}>
          <EventNoteIcon sx={{ mr: 1, color: yalovaRed }} />
          Etkinlik Yönetimi
        </Typography>

        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ backgroundColor: yalovaRed }}
            onClick={() => navigate("/events/create")}
          >
            Etkinlik Oluştur
          </Button>
        )}
      </Stack>

      <TextField
        label="Etkinlik Adı ile Ara"
        size="small"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setPagination((p) => ({ ...p, page: 0 }));
        }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />
        }}
        sx={{ mb: 3, minWidth: 300 }}
      />

      <TableContainer>
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <TableCell>Etkinlik</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Konum</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Oluşturan</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : events.length ? (
              events.map((e) => {
                const s = getStatusColor(e.status);

                // Kullanıcı bu etkinliğin sahibi mi? (Yönetici de her şeyi yönetebilir)
                const isOwner =
                  currentUser &&
                  (currentUser.username === e.createdBy || currentUser.role === "ADMIN");

                return (
                  <StyledTableRow key={e.id}>
                    <TableCell>{e.title}</TableCell>
                    <TableCell>{formatDateTime(e.eventDate)}</TableCell>
                    <TableCell>{e.location}</TableCell>
                    <TableCell>
                      <Chip label={s.label} sx={{ backgroundColor: s.bgColor }} />
                    </TableCell>
                    <TableCell>{e.createdBy}</TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {/* 1. KATILIM DURUMU / BUTONU (Eğer sahip değilse) */}
                        {!isOwner && (
                          <>
                            {e.participationStatus === "APPROVED" ? (
                              <Tooltip title="Katılımınız Onaylandı">
                                <Chip
                                  label="Katılındı"
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleIcon />}
                                  variant="outlined"
                                />
                              </Tooltip>
                            ) : e.participationStatus === "PENDING" ? (
                              <Tooltip title="Yönetici onayı bekleniyor">
                                <Chip
                                  label="Onay Bekliyor"
                                  color="warning"
                                  size="small"
                                  icon={<AccessTimeIcon />}
                                  variant="outlined"
                                />
                              </Tooltip>
                            ) : e.participationStatus === "REJECTED" ? (
                              <Tooltip title="Başvurunuz reddedildi">
                                <Chip
                                  label="Reddedildi"
                                  color="error"
                                  size="small"
                                  icon={<CancelIcon />}
                                  variant="outlined"
                                />
                              </Tooltip>
                            ) : (
                              // Hiç kaydı yoksa (null)
                              <Tooltip title="Etkinliğe Katıl">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleJoin(e.id)}
                                  sx={{
                                    border: "1px solid #1976d2",
                                    "&:hover": { backgroundColor: "#e3f2fd" }
                                  }}
                                >
                                  <GroupAddIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}

                        {/* 2. 🔥 YÖNETİM BUTONU (Sadece Sahibi Görür) */}
                        {isOwner && (
                          <Tooltip title="Başvuruları Yönet">
                            <IconButton
                              color="secondary"
                              onClick={() => handleOpenManager(e)}
                              sx={{ border: "1px solid", borderColor: "secondary.main" }}
                            >
                              <ManageAccountsIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Etkinlik bulunamadı
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalElements}
        page={pagination.page}
        rowsPerPage={pagination.pageSize}
        onPageChange={(_, p) => setPagination((x) => ({ ...x, page: p }))}
        onRowsPerPageChange={(e) => setPagination({ page: 0, pageSize: +e.target.value })}
      />

      {/* 🔥 MODAL */}
      <EventParticipantsDialog
        open={managerOpen}
        onClose={() => setManagerOpen(false)}
        eventId={selectedEventId}
        eventTitle={selectedEventTitle}
      />
    </Card>
  );
}
