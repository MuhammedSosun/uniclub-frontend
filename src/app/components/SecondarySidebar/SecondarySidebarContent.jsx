import IconButton from "@mui/material/IconButton";
import styled from "@mui/material/styles/styled";
import Comment from "@mui/icons-material/Comment";

import { Chatbox, ChatHead } from "app/components";
import { Span } from "../Typography";

// 🔥 DOĞRU IMPORT — boşluk hatası ve yanlış klasör yolu düzeltildi
import AccountSettingsPanel from "../AccountSettingsPanel/AccountSettingsPanel";

// ---------------- STYLED COMPONENT ----------------
const SidebarRoot = styled("div")(({ theme, width }) => ({
  position: "fixed",
  height: "100vh",
  width: width,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: theme.shadows[8],
  backgroundColor: theme.palette.primary.main,
  zIndex: 98,
  transition: "all 0.15s ease",
  color: theme.palette.text.primary,

  "@global": {
    "@media screen and (min-width: 767px)": {
      ".content-wrap, .layout2.layout-contained, .layout2.layout-full": {
        marginRight: width,
      },
      ".matx-customizer": {
        right: width,
      },
    },
    "@media screen and (max-width: 959px)": {
      ".toolbar-menu-wrap .menu-area": {
        width: `calc(100% - ${width})`,
      },
    },
  },
}));

// ---------------- COMPONENT ----------------
export default function SecondarySidebarContent() {
  return (
    <SidebarRoot width={"50px"} className="secondary-sidebar">
      <Span m="auto" />

      {/* 🔥 Hesap Ayarları Paneli */}
      <AccountSettingsPanel />

      {/* Sepet kısmı - istersen bunu da kaldırabiliriz */}

      {/* Chat kısmı */}
      <ChatHead
        icon={
          <IconButton
            size="small"
            sx={{ my: "12px", color: "primary.contrastText" }}
          >
            <Comment />
          </IconButton>
        }
      >
        <Chatbox />
      </ChatHead>

      <Span m="auto" />
    </SidebarRoot>
  );
}
