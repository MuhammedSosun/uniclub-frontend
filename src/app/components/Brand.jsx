import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import { Span } from "./Typography";
import useSettings from "app/hooks/useSettings";

// LOGO PATH
import uniLogo from "../../../public/assets/images/unilogo.png"; 

// STYLED COMPONENTS
const BrandRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "20px 18px 20px 29px",
}));

const LogoImage = styled("img")(({ mode }) => ({
  height: mode === "compact" ? 40 : 48,
  width: "auto",
  transition: "all 0.2s",
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 20,
  marginLeft: "0.7rem",
  fontWeight: 700,
  letterSpacing: 0.5,
  color: "#B00020", // UniClub kırmızı
  display: mode === "compact" ? "none" : "block",
}));

export default function Brand() {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        <LogoImage src={uniLogo} alt="UniClub" mode={mode} />
        <StyledSpan mode={mode}>UniClub</StyledSpan>
      </Box>
    </BrandRoot>
  );
}
