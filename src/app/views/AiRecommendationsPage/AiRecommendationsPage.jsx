import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import RefreshIcon from "@mui/icons-material/Refresh";
import GroupsIcon from "@mui/icons-material/Groups";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PsychologyIcon from "@mui/icons-material/Psychology";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { getAiRecommendations } from "app/services/aiRecommendationService";
import "./AiRecommendationsPage.scss";

const AI_RECOMMENDATION_CACHE_KEY = "aiRecommendationReport";

function AiRecommendationsPage() {
  const navigate = useNavigate();

  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const cachedReport = sessionStorage.getItem(AI_RECOMMENDATION_CACHE_KEY);

    if (cachedReport) {
      try {
        setRecommendationData(JSON.parse(cachedReport));
      } catch {
        sessionStorage.removeItem(AI_RECOMMENDATION_CACHE_KEY);
      }
    }
  }, []);

  const hasReport = Boolean(recommendationData);

  const stats = useMemo(() => {
    return {
      clubs: recommendationData?.recommendedClubs?.length || 0,
      events: recommendationData?.recommendedEvents?.length || 0,
      suggestions: recommendationData?.developmentSuggestions?.length || 0
    };
  }, [recommendationData]);

  async function analyzeProfile({ forceRefresh = false } = {}) {
    try {
      setLoading(true);
      setErrorMessage("");

      if (forceRefresh) {
        sessionStorage.removeItem(AI_RECOMMENDATION_CACHE_KEY);
      }

      const data = await getAiRecommendations();

      sessionStorage.setItem(AI_RECOMMENDATION_CACHE_KEY, JSON.stringify(data));
      setRecommendationData(data);
    } catch (error) {
      console.error("AI recommendation error:", error);
      setErrorMessage("AI önerileri alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  function clearCache() {
    sessionStorage.removeItem(AI_RECOMMENDATION_CACHE_KEY);
    setRecommendationData(null);
    setErrorMessage("");
  }

  return (
    <Box className="ai-page">
      <Container maxWidth="xl">
        <Card className="ai-hero-card">
          <CardContent className="ai-hero-card__content">
            <Box className="ai-hero-card__left">
              <Chip
                icon={<AutoAwesomeIcon />}
                label="AI Destekli Kulüp Danışmanı"
                className="ai-hero-card__chip"
              />

              <Typography variant="h3" className="ai-hero-card__title">
                Sana En Uygun Kulüp ve Etkinlikleri Keşfet
              </Typography>

              <Typography className="ai-hero-card__description">
                Profilindeki bölüm, yetenekler, ilgi alanları, projeler ve sistemdeki kulüp/etkinlik
                verileri analiz edilerek kişiselleştirilmiş öneriler oluşturulur.
              </Typography>

              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                <StatCard label="Kulüp Önerisi" value={stats.clubs} />
                <StatCard label="Etkinlik Önerisi" value={stats.events} />
                <StatCard label="Gelişim Önerisi" value={stats.suggestions} />
              </Stack>
            </Box>

            <Box className="ai-hero-card__right">
              <Box className="ai-robot-box">
                <SmartToyIcon />
              </Box>

              <Stack spacing={1.25}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />
                  }
                  onClick={() => analyzeProfile({ forceRefresh: !hasReport })}
                  disabled={loading}
                  className="ai-primary-button"
                  fullWidth
                >
                  {hasReport ? "Yeniden Analiz Et" : "AI Analizi Başlat"}
                </Button>

                {hasReport && (
                  <Button
                    variant="outlined"
                    startIcon={<DeleteSweepIcon />}
                    onClick={clearCache}
                    disabled={loading}
                    className="ai-outline-button"
                    fullWidth
                  >
                    Kaydedilen Analizi Temizle
                  </Button>
                )}
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {loading && (
          <Card className="ai-loading-card">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CircularProgress size={32} />
                  <Box>
                    <Typography variant="h6">AI analizi hazırlanıyor</Typography>
                    <Typography color="text.secondary">
                      Profil bilgilerin kulüp ve etkinlik verileriyle eşleştiriliyor.
                    </Typography>
                  </Box>
                </Stack>
                <LinearProgress />
              </Stack>
            </CardContent>
          </Card>
        )}

        {errorMessage && (
          <Alert severity="error" className="ai-alert">
            {errorMessage}
          </Alert>
        )}

        {!loading && !hasReport && (
          <Card className="ai-start-card">
            <CardContent>
              <Stack spacing={2.5} alignItems="center" textAlign="center">
                <Box className="ai-start-card__icon">
                  <PsychologyIcon />
                </Box>

                <Box>
                  <Typography variant="h5" fontWeight={900}>
                    Henüz AI analizi oluşturulmadı
                  </Typography>
                  <Typography color="text.secondary" mt={1}>
                    Analizi başlattığında sonuçlar bu oturum boyunca saklanır. Başka sayfaya gidip
                    geri geldiğinde önceki sonucu tekrar görebilirsin.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RocketLaunchIcon />}
                  onClick={() => analyzeProfile()}
                  disabled={loading}
                  className="ai-primary-button"
                >
                  Analizi Başlat
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {!loading && hasReport && (
          <Stack spacing={3}>
            <Card className="ai-summary-card">
              <CardContent>
                <SectionHeader
                  number="01"
                  title="Profil Özeti"
                  description="AI, profilindeki güçlü yönleri kısa şekilde yorumladı."
                  icon={<PsychologyIcon />}
                />

                <Typography className="ai-summary-card__text">
                  {recommendationData.profileSummary}
                </Typography>
              </CardContent>
            </Card>

            <RecommendationSection
              number="02"
              title="Önerilen Kulüpler"
              description="Profilinle en yüksek uyum gösteren kulüpler."
              icon={<GroupsIcon />}
              emptyText="Şu anda profiline uygun kulüp önerisi bulunamadı."
            >
              {recommendationData.recommendedClubs?.map((club) => (
                <RecommendationCard
                  key={club.clubId}
                  type="Kulüp"
                  icon={<GroupsIcon />}
                  title={club.clubName}
                  score={club.matchScore}
                  reason={club.reason}
                  tags={club.matchedAreas}
                  buttonText="Kulüplere Git"
                  onClick={() => navigate("/clubs")}
                />
              ))}
            </RecommendationSection>

            <RecommendationSection
              number="03"
              title="Önerilen Etkinlikler"
              description="Katılman için en uygun yaklaşan etkinlikler."
              icon={<EventAvailableIcon />}
              emptyText="Şu anda sana uygun yaklaşan etkinlik bulunamadı."
            >
              {recommendationData.recommendedEvents?.map((event) => (
                <RecommendationCard
                  key={event.eventId}
                  type="Etkinlik"
                  icon={<EventAvailableIcon />}
                  title={event.eventTitle}
                  score={event.matchScore}
                  reason={event.reason}
                  tags={event.matchedAreas}
                  buttonText="Etkinliklere Git"
                  onClick={() => navigate("/events")}
                />
              ))}
            </RecommendationSection>

            <Card className="ai-suggestions-card">
              <CardContent>
                <SectionHeader
                  number="04"
                  title="Gelişim Önerileri"
                  description="Profilini daha güçlü hale getirmek için kişisel öneriler."
                  icon={<RocketLaunchIcon />}
                />

                {recommendationData.developmentSuggestions?.length > 0 ? (
                  <Grid container spacing={2}>
                    {recommendationData.developmentSuggestions.map((suggestion, index) => (
                      <Grid item xs={12} md={6} key={`${suggestion}-${index}`}>
                        <Box className="ai-suggestion-item">
                          <Box className="ai-suggestion-item__number">
                            {String(index + 1).padStart(2, "0")}
                          </Box>
                          <Typography>{suggestion}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <EmptyState text="Şu anda gelişim önerisi bulunamadı." />
                )}
              </CardContent>
            </Card>
          </Stack>
        )}
      </Container>
    </Box>
  );
}

function SectionHeader({ number, title, description, icon }) {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start" className="ai-section-header">
      <Box className="ai-section-header__number">{number}</Box>

      <Box className="ai-section-header__icon">{icon}</Box>

      <Box>
        <Typography variant="h5" fontWeight={900}>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Box>
    </Stack>
  );
}

function RecommendationSection({ number, title, description, icon, emptyText, children }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;

  return (
    <Card className="ai-section-card">
      <CardContent>
        <SectionHeader number={number} title={title} description={description} icon={icon} />

        {items && items.length > 0 ? (
          <Grid container spacing={2.5}>
            {items.map((item, index) => (
              <Grid item xs={12} lg={6} key={index}>
                {item}
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState text={emptyText} />
        )}
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ type, icon, title, score, reason, tags = [], buttonText, onClick }) {
  const safeScore = Number.isFinite(score) ? score : 0;

  return (
    <Card className="ai-recommendation-card">
      <CardContent className="ai-recommendation-card__content">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box className="ai-recommendation-card__icon">{icon}</Box>

          <Box className="ai-score-badge">
            <Typography variant="h6">{safeScore}%</Typography>
            <Typography>UYUM</Typography>
          </Box>
        </Stack>

        <Box>
          <Chip label={type} size="small" className="ai-type-chip" />
          <Typography variant="h5" className="ai-recommendation-card__title">
            {title}
          </Typography>
        </Box>

        <Typography className="ai-recommendation-card__reason">{reason}</Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {tags?.slice(0, 6).map((tag) => (
            <Chip key={tag} label={tag} className="ai-match-chip" />
          ))}
        </Stack>

        <Divider />

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={onClick}
          className="ai-card-button"
          fullWidth
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value }) {
  return (
    <Box className="ai-stat-card">
      <Typography variant="h5">{value}</Typography>
      <Typography>{label}</Typography>
    </Box>
  );
}

function EmptyState({ text }) {
  return (
    <Box className="ai-empty-state">
      <SmartToyIcon />
      <Typography>{text}</Typography>
    </Box>
  );
}

export default AiRecommendationsPage;
