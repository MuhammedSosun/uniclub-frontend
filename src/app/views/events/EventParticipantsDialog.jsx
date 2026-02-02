import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  Box,
  Divider,
  TextField,
  InputAdornment,
  TablePagination // 🔥 Sayfalama bileşeni
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import eventService from "app/services/eventService";

export default function EventParticipantsDialog({ open, onClose, eventId, eventTitle }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 SAYFALAMA VE ARAMA STATE'LERİ
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal açıldığında veya arama/sayfa değiştiğinde veriyi çek
  useEffect(() => {
    if (open && eventId) {
      // Arama yaparken her tuşa basışta istek gitmesin diye 500ms bekleme (Debounce)
      const delayDebounceFn = setTimeout(() => {
        loadParticipants();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [open, eventId, page, rowsPerPage, searchTerm]);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      // Backend'e sayfa, boyut ve filtre bilgisini gönderiyoruz
      const res = await eventService.getParticipants(eventId, page, rowsPerPage, searchTerm);

      const data = res.data?.payload || res.payload;

      if (data) {
        setParticipants(data.content); // O sayfadaki kişiler
        setTotalElements(data.totalElements); // Toplam kişi sayısı (DB'deki)
      }
    } catch (error) {
      console.error(error);
      toast.error("Katılımcı listesi alınamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (memberId, newStatus) => {
    try {
      await eventService.changeStatus(eventId, memberId, newStatus);
      toast.success(`Durum güncellendi.`);
      loadParticipants(); // Listeyi yenile
    } catch (error) {
      toast.error("İşlem başarısız.");
    }
  };

  // Arama değişince sayfayı başa al
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    if (status === "APPROVED")
      return <Chip label="Onaylı" color="success" size="small" variant="outlined" />;
    if (status === "REJECTED")
      return <Chip label="Reddedildi" color="error" size="small" variant="outlined" />;
    return <Chip label="Bekliyor" color="warning" size="small" variant="filled" />;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ borderBottom: "1px solid #eee", pb: 1 }}>
        Katılımcı Yönetimi
        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
          {eventTitle}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ minHeight: "450px", p: 0, display: "flex", flexDirection: "column" }}>
        {/* ARAMA KUTUSU */}
        <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0", bgcolor: "#fff" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Kullanıcı adı veya e-posta ara..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* LİSTE */}
        <Box flex={1} overflow="auto">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : participants.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%" p={3}>
              <Typography color="text.secondary">
                {searchTerm ? "Aranan kriterde sonuç bulunamadı." : "Henüz başvuru yok."}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {participants.map((p, index) => (
                <Box key={p.memberId}>
                  <ListItem
                    secondaryAction={
                      p.status === "PENDING" && (
                        <Box>
                          <IconButton
                            color="success"
                            onClick={() => handleStatusChange(p.memberId, "APPROVED")}
                            title="Onayla"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleStatusChange(p.memberId, "REJECTED")}
                            title="Reddet"
                          >
                            <CancelIcon />
                          </IconButton>
                        </Box>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#1A2038" }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight="500">{p.username}</Typography>}
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            component="span"
                            display="block"
                            color="text.secondary"
                          >
                            {p.email}
                          </Typography>
                          <Box mt={0.5}>{getStatusChip(p.status)}</Box>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Box>
              ))}
            </List>
          )}
        </Box>

        {/* 🔥 SAYFALAMA KISMI (ALTTA SABİT) */}
        <Box borderTop="1px solid #eee">
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Satır:"
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 1 }}>
        <Button onClick={onClose} color="inherit">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
}
