import { useState } from "react";
import {
  Card,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { createEvent } from "app/services/eventService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EventCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
  });

  const handleSubmit = async () => {
    if (!form.title || !form.eventDate) {
      toast.warning("Etkinlik adı ve tarih zorunludur!");
      return;
    }

    try {
      await createEvent(form);
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
  inputProps={{ min: new Date().toISOString().slice(0, 16) }}
  value={form.eventDate}
  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
  required
/>

        <TextField
          label="Konum"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

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
