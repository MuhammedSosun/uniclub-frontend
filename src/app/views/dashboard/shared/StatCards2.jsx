import { useEffect, useState } from "react";
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import { lighten, styled, useTheme } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Groups from "@mui/icons-material/Groups";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Servis importları
import { getActiveMemberCount } from "app/services/memberService";
import clubService from "app/services/clubService";
import membershipService from "app/services/membershipsService"; // <-- DİKKAT: Burası önemli!

// ---------------- STYLED ----------------
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
  fontWeight: 500,
  marginLeft: 12
}));

const H1 = styled("h1")(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  color: theme.palette.text.secondary
}));

const Span = styled("span")(() => ({
  fontSize: 13,
  marginLeft: 4
}));

const IconBox = styled("div")(() => ({
  width: 16,
  height: 16,
  color: "#fff",
  display: "flex",
  overflow: "hidden",
  borderRadius: 300,
  justifyContent: "center",
  "& .icon": { fontSize: 14 }
}));

// ---------------- COMPONENT ----------------
export default function StatCards2() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const bgPrimary = lighten(palette.primary.main, 0.85);

  // LocalStorage'dan User ID (Giriş kontrolü için)
  const currentUserId = localStorage.getItem("userId");

  const [memberCount, setMemberCount] = useState(null);
  const [activeClubCount, setActiveClubCount] = useState(null);
  const [myClubId, setMyClubId] = useState(null);

  useEffect(() => {
    // 1. Aktif Kullanıcı Sayısı
    getActiveMemberCount()
      .then((data) => setMemberCount(data.payload))
      .catch((err) => console.error("Member count error:", err));

    // 2. Aktif Kulüp Sayısı
    clubService
      .getActiveClubsCount()
      .then((data) => setActiveClubCount(data.payload))
      .catch((err) => console.error("Active club count error:", err));

    // 3. Başkanlık Kontrolü (Backend'den 'my-club' ile çekiyoruz)
    if (currentUserId) {
      // DİKKAT: Metodu membershipService'e eklediğin için oradan çağırıyoruz
      membershipService
        .getMyClub()
        .then((res) => {
          if (res.payload) {
            console.log("✅ Kulübüm bulundu:", res.payload.clubName);
            setMyClubId(res.payload.id); // ID: 15 set edilecek
          }
        })
        .catch((err) => {
          // Kullanıcı başkan değilse buraya düşer, sorun yok.
          console.log("Başkan olunan kulüp yok.");
        });
    }
  }, [currentUserId]);

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* ---------------- Kullanıcı Sayısı ---------------- */}
      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: "rgba(9,182,109,0.15)" }}>
              <TrendingUp color="success" />
            </FabIcon>
            <H3 color="#08ad6c">Kullanıcı Sayısı</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{memberCount !== null ? memberCount : "--"}</H1>
            <IconBox sx={{ backgroundColor: "success.main" }}>
              <ExpandLess className="icon" />
            </IconBox>
            <Span>aktif</Span>
          </ContentBox>
        </Card>
      </Grid>

      {/* ---------------- Kulübüm (SADECE BAŞKAN İÇİN GÖRÜNÜR) ---------------- */}
      {myClubId && (
        <Grid size={{ md: 6, xs: 12 }}>
          <Card elevation={3} sx={{ p: 2 }}>
            <ContentBox>
              <FabIcon size="medium" sx={{ backgroundColor: bgPrimary }}>
                <Groups color="primary" />
              </FabIcon>
              <H3 color="primary.main">Kulübüm</H3>
            </ContentBox>

            <ContentBox sx={{ pt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/clubs/${myClubId}/members/manage`)}
              >
                Üyeleri Yönet
              </Button>
            </ContentBox>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
