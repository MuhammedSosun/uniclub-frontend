import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Stack,
  Typography,
  Paper,
  InputAdornment,
  Box,
  Divider // Gerekli component'i ekliyoruz
} from "@mui/material";

// İkonlar
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import InstagramIcon from "@mui/icons-material/Instagram";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LinkIcon from "@mui/icons-material/Link";
import clubService from "app/services/clubService";

// Yalova Üniversitesi Bordo/Kırmızı Tonu (Ana Vurgu)
const YU_BORDO = "#8B0000";
// Açık Bordo Arkaplan (Başlıklar için)
const YU_BORDO_LIGHT = "#f7eaea";

// ---------------- YARDIMCI BİLEŞENLER (BLOKLU BAŞLIK STİLİ) ----------------

/**
 * image_55f260.jpg'deki Güçlü Bordo Vurgulu Blok Başlık Stili
 */
const SectionHeader = ({ title, subtitle }) => (
  <Grid item xs={12}>
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 2,
        backgroundColor: YU_BORDO_LIGHT, // Açık bordo arkaplan
        borderLeft: `5px solid ${YU_BORDO}`, // Güçlü sol çizgi
        borderRadius: 1,
        // İçeriği merkeze hizalayan bir Flexbox yapısı
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ color: YU_BORDO }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  </Grid>
);

// ---------------- ANA BİLEŞEN ----------------
export default function ClubForm({ initialValues, onSubmit, isEdit }) {
  // ---------------- STATE (İŞ MANTIĞI KORUNDU) ----------------
  const [formData, setFormData] = useState({
    clubName: "",
    shortName: "",
    description: "",
    logoUrl: "",
    foundationDate: "",
    email: "",
    phone: "",
    instagram: "",
    approved: false,
    status: "ACTIVE",
    presidentId: ""
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // sadece base64
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        approved:
          initialValues.approved === true || initialValues.approved === "true" ? "true" : "false"
      });
    }
  }, [initialValues]);
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "approved") {
      finalValue = value === "true";
    }
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(
      {
        ...formData,
        approved: Boolean(formData.approved)
      },
      logoFile
    );
  };

  // ---------------- UI ----------------
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        {/* BÖLÜM 1: TEMEL KİMLİK */}
        <SectionHeader
          title="1. Kulüp Kimliği ve Tanıtım"
          subtitle="Kulübün adı, kısa açıklaması ve kurumsal bilgileri."
        />

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Kulüp Adı"
            name="clubName"
            value={formData.clubName}
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Kısa Ad (Örn: UniAI)"
            name="shortName"
            value={formData.shortName}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Açıklama (Misyon ve Vizyon)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            placeholder="Kulübünüzün amaçlarını, düzenlediği etkinlikleri ve hedef kitlesini kısaca açıklayın."
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Kulüp Logosu</Typography>

            <Button variant="outlined" component="label" startIcon={<LinkIcon />}>
              Logo Seç
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setLogoFile(file);
                    setLogoPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </Button>

            {logoPreview && (
              <Box mt={1}>
                <img
                  src={logoPreview}
                  alt="Logo Önizleme"
                  style={{ maxHeight: 120, borderRadius: 8 }}
                />
              </Box>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Kuruluş Tarihi"
            name="foundationDate"
            InputLabelProps={{ shrink: true }}
            value={formData.foundationDate}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRangeIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* BÖLÜM 2: İLETİŞİM */}
        <SectionHeader
          title="2. İletişim Bilgileri"
          subtitle="Üyelerin ve dış paydaşların kulübe ulaşabileceği kanallar."
        />

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="E-posta"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Telefon"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+90555..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Instagram Bilgisi"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InstagramIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* BÖLÜM 3: YÖNETİM VE DURUM */}
        <SectionHeader
          title="3. Yönetim ve Durum Ayarları"
          subtitle="Bu alanlar sadece kulüp yöneticileri tarafından düzenlenmelidir."
        />

        {/* Approved */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Onay Durumu"
            name="approved"
            value={formData.approved === true ? "true" : "false"}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CheckCircleOutlineIcon sx={{ color: YU_BORDO }} />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="true" sx={{ color: "success.main", fontWeight: 500 }}>
              ✅ Onaylı (Aktif)
            </MenuItem>
            <MenuItem value="false" sx={{ color: "error.main", fontWeight: 500 }}>
              ❌ Onaysız (İncelemede)
            </MenuItem>
          </TextField>
        </Grid>

        {/* Status */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Kulüp Durumu"
            name="status"
            value={formData.status}
            onChange={handleChange}
            variant="outlined"
            // Bordo vurgu
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VisibilityIcon sx={{ color: YU_BORDO }} />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="ACTIVE" sx={{ color: "success.main" }}>
              🟢 ACTIVE (Aktif Görünür)
            </MenuItem>
            <MenuItem value="SUSPENDED" sx={{ color: "warning.main" }}>
              ⏸️ SUSPENDED (Geçici Askıda)
            </MenuItem>
            <MenuItem value="TERMINATED" sx={{ color: "error.main" }}>
              🚫 TERMINATED (Kapatıldı)
            </MenuItem>
            <MenuItem value="PRIVATE">🔒 PRIVATE (Sadece Üyelere Açık)</MenuItem>
            <MenuItem value="INCOMPLETED" sx={{ color: "info.main" }}>
              📝 INCOMPLETED (Bilgiler Eksik)
            </MenuItem>
          </TextField>
        </Grid>

        {/* Butonlar: image_55f260.jpg'deki gibi Bordo Vurgu */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end" pt={2} gap={2}>
            {/* İptal butonu: Sade, vurgusuz */}
            <Button
              variant="text"
              color="secondary"
              onClick={() => window.history.back()}
              size="large"
            >
              İptal
            </Button>

            {/* Kaydet butonu: Güçlü Bordo/Kırmızı Vurgu */}
            <Button
              type="submit"
              variant="contained"
              // Bordo rengi direkt sx ile uygulandı
              sx={{
                backgroundColor: YU_BORDO,
                "&:hover": { backgroundColor: "#A52A2A" }, // Hover rengi biraz daha açık bordo
                boxShadow: "0 4px 10px rgba(139, 0, 0, 0.3)" // Bordo gölge
              }}
              size="large"
            >
              {isEdit ? "Kulübü Güncelle" : "Kulübü Kaydet"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}
