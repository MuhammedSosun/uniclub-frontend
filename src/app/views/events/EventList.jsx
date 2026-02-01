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
  TablePagination
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SearchIcon from "@mui/icons-material/Search";

import eventService from "app/services/eventService";

const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

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

  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 5
  });

  const navigate = useNavigate();

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

      setEvents(response.payload.content);
      setTotalElements(response.payload.totalElements);
    } catch (err) {
      toast.error("Etkinlikler yüklenemedi");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [pagination, filter]);

  const formatDateTime = (date) => new Date(date).toLocaleString("tr-TR");

  return (
    <Card sx={{ p: 4, borderRadius: 2, boxShadow: 6 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700} sx={{ color: primaryDark }}>
          <EventNoteIcon sx={{ mr: 1, color: yalovaRed }} />
          Etkinlik Yönetimi
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: yalovaRed }}
          onClick={() => navigate("/events/create")}
        >
          Etkinlik Oluştur
        </Button>
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
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : events.length ? (
              events.map((e) => {
                const s = getStatusColor(e.status);
                return (
                  <StyledTableRow key={e.id}>
                    <TableCell>{e.title}</TableCell>
                    <TableCell>{formatDateTime(e.eventDate)}</TableCell>
                    <TableCell>{e.location}</TableCell>
                    <TableCell>
                      <Chip label={s.label} sx={{ backgroundColor: s.bgColor }} />
                    </TableCell>
                    <TableCell>{e.createdBy}</TableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
    </Card>
  );
}
