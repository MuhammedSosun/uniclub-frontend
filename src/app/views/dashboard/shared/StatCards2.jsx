import { useEffect, useState } from "react";
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import { lighten, styled, useTheme } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import StarOutline from "@mui/icons-material/StarOutline";
import TrendingUp from "@mui/icons-material/TrendingUp";

import { getActiveMemberCount } from "app/services/memberService"; // 🔥 API
import clubService from "app/services/clubService";

// STYLED COMPONENTS (AYNI)
const ContentBox = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center"
}));

const FabIcon = styled(Fab)(() => ({
  width: "44px !important",
  height: "44px !important",
  boxShadow: "none !important"
}));

const H3 = styled("h3")(() => ({
  margin: 0,
  fontWeight: "500",
  marginLeft: "12px"
}));

const H1 = styled("h1")(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  color: theme.palette.text.secondary
}));

const Span = styled("span")(() => ({
  fontSize: "13px",
  marginLeft: "4px"
}));

const IconBox = styled("div")(() => ({
  width: 16,
  height: 16,
  color: "#fff",
  display: "flex",
  overflow: "hidden",
  borderRadius: "300px ",
  justifyContent: "center",
  "& .icon": { fontSize: "14px" }
}));

export default function StatCards2() {
  const { palette } = useTheme();
  const bgError = lighten(palette.error.main, 0.85);

  const [memberCount, setMemberCount] = useState(null);
  const [activeClubCount, setActiveClubCount] = useState(null);

  useEffect(() => {
    getActiveMemberCount()
      .then((data) => {
        setMemberCount(data.payload);
      })
      .catch((err) => {
        console.error("Member count error:", err);
      });

    clubService
      .getActiveClubsCount()
      .then((data) => {
        setActiveClubCount(data.payload);
      })
      .catch((err) => {
        console.error("Active club count error:", err);
      });
  }, []);

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: "rgba(9, 182, 109, 0.15)" }}>
              <TrendingUp color="success" />
            </FabIcon>

            <H3 color="#08ad6c">Kullanıcı Sayısı</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{memberCount !== null ? memberCount : "--"}</H1>

            <IconBox sx={{ backgroundColor: "success.main" }}>
              <ExpandLess className="icon" />
            </IconBox>

            <Span color="#08ad6c">aktif</Span>
          </ContentBox>
        </Card>
      </Grid>

      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ backgroundColor: bgError }}>
              <StarOutline color="error" />
            </FabIcon>

            <H3 color="error.main">Aktif Kulüp Sayısı</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{typeof activeClubCount === "number" ? activeClubCount : "--"}</H1>
          </ContentBox>
        </Card>
      </Grid>
    </Grid>
  );
}
