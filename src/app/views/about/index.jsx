import { Box, Typography, Container, Divider, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import CodeIcon from "@mui/icons-material/Code";
import TerminalIcon from "@mui/icons-material/Terminal";

// --- TEMA RENKLERİ ---
const yalovaRed = "#B00020";
const primaryDark = "#1A2038";
const lightText = "#E3F2FD";

// --- STYLED COMPONENTS ---

// Sayfa kökü: Koyu temayı korur
const AboutRoot = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  background: theme.palette.mode === "dark" ? "#121212" : "#f4f6f8"
}));

// Başlık Bölümü: Geniş ve çarpıcı
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(90deg, ${primaryDark} 50%, #000 100%)`,
  color: lightText,
  padding: theme.spacing(8, 0),
  textAlign: "center",
  marginBottom: theme.spacing(4),
  clipPath: "polygon(0 0, 100% 0, 100% 90%, 0% 100%)" // Hafif dalgalı alt kesim
}));

// İçerik Kartları: Temiz ve okunaklı
const ContentCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: theme.shadows[4],
  marginBottom: theme.spacing(4),
  transition: "transform 0.3s",
  "&:hover": {
    transform: "translateY(-5px)"
  }
}));

// Ana Metin Bölümü
const ContentText = ({ children }) => (
  <Typography
    variant="body1"
    sx={{
      color: "text.secondary",
      fontSize: "1.1rem",
      lineHeight: 1.7,
      mb: 2,
      textAlign: "justify"
    }}
  >
    {children}
  </Typography>
);

// Öne Çıkan Başlık (Kırmızı Vurgu)
const FeatureHeader = ({ icon: Icon, title, mb = 2 }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: mb }}>
    <Icon sx={{ color: yalovaRed, fontSize: 30, mr: 1.5 }} />
    <Typography
      variant="h5"
      fontWeight={700}
      sx={{
        color: primaryDark,
        textShadow: "1px 1px 1px rgba(0,0,0,0.1)"
      }}
    >
      {title}
    </Typography>
  </Box>
);

// Yeni Kontrol: Kod Listesi (Teknolojiler)
const CodeList = ({ title, items }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" fontWeight={700} mb={1} sx={{ color: yalovaRed }}>
      {title}
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {items.map((item, index) => (
        <Typography
          key={index}
          variant="caption"
          sx={{
            backgroundColor: "#eee",
            color: primaryDark,
            p: 1,
            borderRadius: 1,
            fontWeight: 600,
            border: `1px solid ${yalovaRed}`
          }}
        >
          {item}
        </Typography>
      ))}
    </Box>
  </Box>
);

// --- YENİ İÇERİK (Sizin sağladığınız metin) ---
const finalContent = {
  tanitim:
    "UniClub, üniversite kulüplerinin etkinlik, üyelik, duyuru ve yönetim süreçlerini dijital bir platformda birleştirmeyi amaçlayan modern bir kulüp yönetim sistemidir. Proje, kullanıcı dostu arayüzü, güçlü backend mimarisi ve ölçeklenebilir yapısıyla üniversite topluluklarının ihtiyaçlarına yönelik kapsamlı bir çözüm sunmaktadır.",
  amac: [
    "Etkinlik oluşturma & yönetme",
    "Üye yönetim süreçlerini kolaylaştırma",
    "Kulüp yöneticileri, üyeler ve akademik danışman arasında köprü kurma",
    "Üniversite içi sosyal etkileşimi artırma",
    "Yönetimsel iş yükünü azaltma",
    "Tüm kulüp faaliyetlerini tek platformda toplama"
  ],
  backend: [
    "Java 21 & Spring Boot",
    "Spring Security (JWT Authentication)",
    "JPA/Hibernate",
    "PostgreSQL",
    "Flyway DB Migration",
    "DTO, MapStruct",
    "Layered Architecture",
    "Exception Handling Middleware"
  ],
  frontend: [
    "React ",
    "Context API / State Management",
    "MUI – Modern UI Kütüphanesi",
    "JWT Token Yönetimi",
    "Responsive Dashboard Tasarımı",
    "Veri Görselleştirme Grafikleri"
  ],
  diger: [
    "Docker",
    "Postman",
    "Git & GitHub",
    "Clean Architecture",
    "CI/CD mantığına uygun dosya yapısı"
  ],
  ekip: {
    muhammedSosun: {
      adi: "Muhammed Sosun",
      unvan: "Yalova Üniversitesi — Bilgisayar Mühendisliği 4. Sınıf Öğrencisi",
      rol: "Full-Stack Geliştirme, Sistem Tasarımı, Uygulama Güvenliği, Dashboard ve Yönetim Ekranları"
    },
    muhammedErenSanci: {
      adi: "Muhammed Eren Şancı",
      unvan: "Yalova Üniversitesi — Bilgisayar Mühendisliği 4. Sınıf Öğrencisi",
      rol: "FinTech (2 Yıl) Yazılım Tecrübesi, Backend API, Veri Yönetimi, Performans Optimizasyonu, Kurumsal Kod Standartları"
    },
    danisman: "Dr. Öğr. Üyesi Güneş Harman"
  },
  sonuc:
    "UniClub, üniversite kulüplerinin dijital dönüşümüne katkı sağlayan, modern yazılım teknolojileriyle geliştirilmiş, akademik ve pratik değeri yüksek bir bitirme projesidir. Hem teknik yetkinlikleri hem de takım çalışmasını ön plana çıkaran bu proje, öğrencilerin gerçek dünya uygulamalarına hazır şekilde yetişmesine katkı sağlamaktadır."
};

export default function About() {
  return (
    <AboutRoot>
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight={800} mb={1}>
            <InfoIcon sx={{ fontSize: 40, mr: 2, color: yalovaRed }} />
            UniClub Projesi Hakkında
          </Typography>
          <Typography variant="h6" opacity={0.8}>
            Kulüp Yönetim Sisteminin Hikayesi, Amacı ve Teknik Derinliği
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        {/* PROJE TANITIMI */}
        <ContentCard>
          <FeatureHeader icon={SchoolIcon} title="Proje Özeti ve Kapsamı" />
          <ContentText>{finalContent.tanitim}</ContentText>
          <Typography variant="body2" sx={{ color: "text.primary", mt: 3, fontWeight: 600 }}>
            Bu proje, akademik danışmanlık altında yürütülmüştür:
            <Box component="span" sx={{ ml: 1, color: yalovaRed }}>
              {finalContent.ekip.danisman}
            </Box>
          </Typography>
        </ContentCard>

        {/* PROJENİN AMACI */}
        <ContentCard>
          <FeatureHeader icon={GroupIcon} title="Temel Amacı ve Sunduğu Çözümler" />
          <Grid container spacing={2}>
            {finalContent.amac.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    p: 2,
                    borderLeft: `3px solid ${yalovaRed}`,
                    height: "100%",
                    backgroundColor: "background.default",
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={1} sx={{ color: primaryDark }}>
                    Amaç {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </ContentCard>

        {/* KULLANILAN TEKNOLOJİLER */}
        <ContentCard>
          <FeatureHeader icon={TerminalIcon} title="Kullanılan Teknolojiler" mb={3} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <CodeList
                title="🔹 Backend Mimarisi (Java & Spring Boot)"
                items={finalContent.backend}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CodeList title="🔹 Frontend (React/Angular & MUI)" items={finalContent.frontend} />
            </Grid>
            <Grid item xs={12}>
              <CodeList title="🔹 Diğer Araçlar ve Standartlar" items={finalContent.diger} />
            </Grid>
          </Grid>
        </ContentCard>

        {/* EKİP ÇALIŞMASI VE GELİŞTİRİCİLER */}
        <ContentCard>
          <FeatureHeader icon={CodeIcon} title="Geliştirme Ekibi ve Görev Dağılımı" />
          <ContentText>
            Bu uyumlu görev dağılımı sayesinde UniClub, gerçek kurumsal projelerde kullanılan
            standartlara uygun, sürdürülebilir ve geliştirilebilir bir yapıda tasarlanmıştır.
          </ContentText>
          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            {/* Muhammed Sosun */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, border: `1px solid ${yalovaRed}`, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: yalovaRed, mb: 0.5 }}>
                  👤 {finalContent.ekip.muhammedSosun.adi}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: primaryDark, mb: 1 }}>
                  {finalContent.ekip.muhammedSosun.unvan}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  **Rol:** {finalContent.ekip.muhammedSosun.rol}
                </Typography>
              </Box>
            </Grid>

            {/* Muhammed Eren Şancı */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, border: `1px solid ${yalovaRed}`, borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: yalovaRed, mb: 0.5 }}>
                  👤 {finalContent.ekip.muhammedErenSanci.adi}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: primaryDark, mb: 1 }}>
                  {finalContent.ekip.muhammedErenSanci.unvan}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  **Rol:** {finalContent.ekip.muhammedErenSanci.rol}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </ContentCard>

        {/* SONUÇ */}
        <ContentCard>
          <FeatureHeader icon={InfoIcon} title="Sonuç ve Akademik Değer" />
          <ContentText>{finalContent.sonuc}</ContentText>
        </ContentCard>
      </Container>
    </AboutRoot>
  );
}
