import { useState, useEffect } from "react";
import {
  Card,
  TextField,
  Typography,
  Button,
  Stack,
  Box,
  Grid,
  CircularProgress
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

import eventService from "app/services/eventService";
import clubService from "app/services/clubService";

import EventIcon from "@mui/icons-material/Event";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

const HeaderBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "24px",
  borderBottom: `2px solid ${yalovaRed}`,
  paddingBottom: "12px",
}));

export default function EventCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    clubIds: [],
  });

  const [clubs, setClubs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedClubs, setSelectedClubs] = useState([]);



  // İlk açılışta tüm kulüpler gelsin
  useEffect(() => {
    fetchClubs("");
  }, []);

  // Kullanıcı yazdıkça arama yap → debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchClubs(searchText);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchText]);

  // Backend’den kulüp çekme
  const fetchClubs = async (text) => {
    try {
      setLoadingClubs(true);
      const res = await clubService.searchClubs(text);
      setClubs(res.payload?.content ?? []);
    } catch (err) {
      toast.error("Kulüpler yüklenemedi!");
    } finally {
      setLoadingClubs(false);
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
    <Card
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 2,
        boxShadow: 8,
        maxWidth: 900,
        mx: "auto",
        mt: 4,
      }}
    >
      <HeaderBox>
        <EventIcon sx={{ color: yalovaRed, fontSize: 32, mr: 1.5 }} />
        <Typography variant="h4" fontWeight={700} sx={{ color: primaryDark }}>
          Yeni Etkinlik Oluşturma Formu
        </Typography>
      </HeaderBox>

      <Grid container spacing={4}>
        {/* Etkinlik adı */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Etkinlik Adı"
            fullWidth
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            InputProps={{
              startAdornment: <EventIcon sx={{ mr: 1, color: "action.active" }} />,
            }}
          />
        </Grid>

        {/* Tarih */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Etkinlik Tarihi"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            InputProps={{
              startAdornment: (
                <CalendarMonthIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
          />
        </Grid>

        {/* Konum */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Konum"
            fullWidth
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            InputProps={{
              startAdornment: (
                <LocationOnIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
          />
        </Grid>

        {/* 🔥 KULÜP ARAMA + ÇOKLU SEÇİM */}
        <Grid item xs={12} sm={6}>
          <Autocomplete
  multiple
  options={clubs}
  getOptionLabel={(option) => option.clubName}
  value={selectedClubs}              // 🔥 sadece seçilenler
  inputValue={inputValue}            // 🔥 yazılan text
  onInputChange={(event, newValue) => {
    setInputValue(newValue);         // yazı artık kaybolmaz
    handleClubSearch(newValue);      // backend araması
  }}
  onChange={(event, newSelected) => {
    setSelectedClubs(newSelected);
    setForm({
      ...form,
      clubIds: newSelected.map((s) => s.id),
    });
  }}
  renderInput={(params) => (
    <TextField {...params} label="Kulüp Ara ve Seç" />
  )}
/>

        </Grid>

        {/* Açıklama */}
        <Grid item xs={12}>
          <TextField
            label="Açıklama"
            fullWidth
            multiline
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            InputProps={{
              startAdornment: (
                <DescriptionIcon sx={{ mr: 1, color: "action.active", mt: 1 }} />
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Butonlar */}
      <Stack direction="row" spacing={2} mt={5} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => navigate("/events")}
          sx={{ px: 3, borderColor: primaryDark, color: primaryDark }}
        >
          Vazgeç
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ px: 4, backgroundColor: yalovaRed }}
        >
          Etkinliği Oluştur
        </Button>
      </Stack>
    </Card>
  );
}
