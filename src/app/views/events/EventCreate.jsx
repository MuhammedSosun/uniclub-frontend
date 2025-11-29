import { useState, useEffect } from "react";
import {
  Card,
  TextField,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import eventService from "app/services/eventService";
import clubService from "app/services/clubService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EventCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    clubIds: [],  // ✔ DTO’ya uygun hale getirildi
  });

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      const res = await clubService.getAllPaged({
        pageNumber: 0,
        pageSize: 100,
      });
      setClubs(res.payload.items || []);
    } catch (err) {
      toast.error("Kulüpler yüklenemedi!");
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.eventDate || !form.location) {
      toast.warning("Etkinlik adı, tarih ve konum zorunludur!");
      return;
    }

    if (form.clubIds.length === 0) {
      toast.warning("En az bir kulüp seçmelisiniz!");
      return;
    }

    try {
      await eventService.createEvent(form);
      toast.success("Etkinlik başarıyla oluşturuldu!");
      navigate("/events");
    } catch (err) {
      toast.error("Etkinlik oluşturulamadı!");
    }
  };

  return (
    <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3, maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        ➕ Yeni Etkinlik Oluştur
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Etkinlik Adı"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <TextField
          label="Açıklama"
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <TextField
          label="Etkinlik Tarihi"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: new Date().toISOString().slice(0, 16) }} // @Future validasyonu için
          value={form.eventDate}
          onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
          required
        />

        <TextField
          label="Konum"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        {/* ✔ Kulüpler İçin Çoklu Seçim */}
        <FormControl fullWidth>
          <InputLabel>Kulüpler</InputLabel>
          <Select
            multiple
            value={form.clubIds}
            onChange={(e) => setForm({ ...form, clubIds: e.target.value })}
            input={<OutlinedInput label="Kulüpler" />}
            renderValue={(selected) =>
              clubs
                .filter((club) => selected.includes(club.id))
                .map((club) => club.name)
                .join(", ")
            }
          >
            {clubs.map((club) => (
              <MenuItem key={club.id} value={club.id}>
                <Checkbox checked={form.clubIds.includes(club.id)} />
                <ListItemText primary={club.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Oluştur
          </Button>

          <Button variant="outlined" onClick={() => navigate("/events")}>
            Vazgeç
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
