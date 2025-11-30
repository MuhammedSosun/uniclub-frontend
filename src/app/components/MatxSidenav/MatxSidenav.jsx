import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";

// Yalova kırmızı tonu
const YU_RED = "#B00020";

// Sidebar Container
const SideNav = styled("div")(({ theme, width }) => ({
  zIndex: 91,
  width: width,
  overflow: "hidden",
  position: "relative",
  transition: "width 250ms ease, background 0.25s ease",
  background: YU_RED,
  color: "#fff",
  borderRight: `1px solid rgba(255,255,255,0.15)`,

  [theme.breakpoints.down("sm")]: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
  },

  // Menü item hover efekti (global)
  "& .MuiListItem-root:hover": {
    background: "rgba(255,255,255,0.18)",
  },

  // Menü ikonları
  "& .MuiSvgIcon-root": {
    color: "#fff !important",
  },

  // Metinler
  "& .MuiTypography-root": {
    color: "#fff !important",
    fontWeight: 500,
  }
}));

// Mobile overlay
const SideNavOverlay = styled("div")(() => ({
  zIndex: 90,
  width: "100%",
  height: "100%",
  position: "absolute",
  background: "rgba(0, 0, 0, 0.74)",
}));

export default function MatxSidenav({ sx, open, children, toggleSidenav, width = "230px" }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box height="100%" display="flex">
      <SideNav sx={sx} width={open || !isMobile ? width : "0px"}>
        {children}
      </SideNav>

      {open && isMobile && <SideNavOverlay onClick={toggleSidenav} />}
    </Box>
  );
}
