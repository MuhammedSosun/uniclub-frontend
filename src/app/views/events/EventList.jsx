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
} from "@mui/material";
import eventService from "app/services/eventService";
import { toast } from "react-toastify";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await eventService.getAllEvents();
      setEvents(res.payload || []);
    } catch (err) {
      toast.error("Etkinlikler yüklenirken hata oluştu!");
    }
  };

  const handleFilterChange = async (e) => {
    const value = e.target.value;
    setFilter(value);

    try {
      const res = await eventService.searchEvents(value);
      setEvents(res.payload || []);
    } catch (err) {
      toast.error("Filtreleme sırasında hata oluştu!");
    }
  };

  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        🎯 Etkinlik Listesi
      </Typography>

      <TextField
        label="Etkinlik Adı ile Ara"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f7f7f7" }}>
            <TableCell><strong>Etkinlik Adı</strong></TableCell>
            <TableCell><strong>Tarih</strong></TableCell>
            <TableCell><strong>Konum</strong></TableCell>
            <TableCell><strong>Açıklama</strong></TableCell>
            <TableCell><strong>Oluşturan</strong></TableCell>
            <TableCell><strong>Oluşturma Tarihi</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {events.length > 0 ? (
            events.map((e) => (
              <TableRow key={e.id} hover sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
                <TableCell>{e.title}</TableCell>

                <TableCell>
                  {new Date(e.eventDate).toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>

                <TableCell>{e.location || "—"}</TableCell>

                <TableCell>
                  {e.description
                    ? e.description.length > 40
                      ? e.description.substring(0, 40) + "..."
                      : e.description
                    : "—"}
                </TableCell>

                <TableCell>{e.createdBy || "—"}</TableCell>

                <TableCell>
                  {new Date(e.createdAt).toLocaleDateString("tr-TR")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Box py={2}>
                  <Typography color="text.secondary">
                    Henüz etkinlik bulunmuyor.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
