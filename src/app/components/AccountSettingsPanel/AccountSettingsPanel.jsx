import { Fragment, useState } from "react";
import Scrollbar from "react-perfect-scrollbar";
import Close from "@mui/icons-material/Close";
import Settings from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import styled from "@mui/material/styles/styled";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// STYLED
const Label = styled("span")(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  borderRadius: "4px",
  marginBottom: "2.5rem",
  letterSpacing: "1.5px",
  padding: ".25rem .5rem",
  transform: "rotate(90deg)",
  backgroundColor: theme.palette.primary.dark,
  color: "#fff"
}));

export default function AccountSettingsPanel() {
  const [open, setOpen] = useState(false);

  const togglePanel = () => setOpen(!open);

  return (
    <Fragment>
      <Tooltip title="Hesap Ayarları" placement="left">
        <Label onClick={togglePanel}>AYARLAR</Label>
      </Tooltip>

      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={togglePanel}
        ModalProps={{ keepMounted: true }}
      >
        <Box
          sx={{
            width: 340,
            height: "100vh",
            p: 3,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <Settings color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Hesap Ayarları
              </Typography>
            </Box>

            <IconButton onClick={togglePanel}>
              <Close />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Scrollbar style={{ flex: 1 }}>
            {/* Profil Bilgileri */}
            <Typography fontWeight={600} mb={1}>
              Profil Bilgileri
            </Typography>

            <TextField
              fullWidth
              label="Ad Soyad"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="E-posta"
              disabled
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Kullanıcı Adı"
              variant="outlined"
              size="small"
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 2 }} />

            {/* Şifre Değiştir */}
            <Typography fontWeight={600} mb={1}>
              Şifre Değiştir
            </Typography>

            <TextField
              fullWidth
              label="Eski Şifre"
              type="password"
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Yeni Şifre"
              type="password"
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Yeni Şifre (Tekrar)"
              type="password"
              size="small"
              sx={{ mb: 3 }}
            />

            <Button variant="contained" fullWidth sx={{ mb: 3 }}>
              Şifreyi Güncelle
            </Button>

            <Divider sx={{ my: 2 }} />

            {/* BİLDİRİMLER */}
            <Typography fontWeight={600} mb={1}>
              Bildirim Ayarları
            </Typography>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <span>Etkinlik Bildirimleri</span>
              <Switch defaultChecked />
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <span>Kulüp Duyuruları</span>
              <Switch />
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <span>Sistem Uyarıları</span>
              <Switch defaultChecked />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Çıkış */}
            <Button color="error" variant="outlined" fullWidth>
              Çıkış Yap
            </Button>
          </Scrollbar>
        </Box>
      </Drawer>
    </Fragment>
  );
}
