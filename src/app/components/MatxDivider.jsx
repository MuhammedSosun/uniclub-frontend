import styled from "@mui/material/styles/styled";

const DividerRoot = styled("div")(({ theme }) => ({
  width: "100%",
  textAlign: "center",
  position: "relative",
  margin: "24px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&::before, &::after": {
    content: '""',
    flex: 1,
    height: 3,
    borderRadius: 2,
  },

  // Sol çizgi (Yalova Kırmızı)
  "&::before": {
    marginRight: 12,
    backgroundColor: "#D50000", // Yalova kırmızısı
  },

  // Sağ çizgi (Yalova Açık Mavi)
  "&::after": {
    marginLeft: 12,
    backgroundColor: "#03A9F4", // Yalova açık mavi
  },

  "& span": {
    zIndex: 2,
    background: theme.palette.background.paper,
    padding: "4px 10px",
    borderRadius: 6,
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: "0.9rem",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
  }
}));

export default function MatxDivider({ text, sx }) {
  return (
    <DividerRoot sx={sx}>
      {text && <span>{text}</span>}
    </DividerRoot>
  );
}
