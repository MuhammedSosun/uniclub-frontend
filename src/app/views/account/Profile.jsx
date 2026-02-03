import {
  Box,
  Card,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Typography,
  Grid
} from "@mui/material";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useProfile } from "./hooks/useProfile";
import memberService from "app/services/memberService";

// Alt Bileşenler
import ProfileHeader from "./components/ProfileHeader";
import AcademicInfo from "./components/AcademicInfo";
import SocialMediaLinks from "./components/SocialMediaLinks";
import MultiValueInput from "./components/MultiValueInput";

export default function Profile() {
  const navigate = useNavigate();
  const { initialValues, loading, error } = useProfile();

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!initialValues) return null;

  return (
    <Box py={6} px={2} sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Card
        sx={{
          maxWidth: 950,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <ProfileHeader memberStatus={initialValues.status} />

        <Formik
          initialValues={initialValues}
          enableReinitialize // Backend'den gelen verilerin forma oturması için şart
          onSubmit={async (values) => {
            try {
              await memberService.updateMyProfile(values);
              navigate("/dashboard");
            } catch (e) {
              console.error("Güncelleme hatası:", e);
            }
          }}
        >
          {({ values, handleChange, handleSubmit, isSubmitting }) => (
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 5 }}>
              <Stack spacing={4}>
                {/* 1. Akademik Bölüm */}
                <Typography variant="h6" fontWeight={700} color="primary">
                  Akademik Bilgiler
                </Typography>
                <AcademicInfo values={values} handleChange={handleChange} />

                <Divider />

                {/* 2. Sosyal Medya Bölümü */}
                <Typography variant="h6" fontWeight={700} color="primary">
                  Sosyal Medya & İletişim
                </Typography>
                <SocialMediaLinks values={values} handleChange={handleChange} />

                <Divider />

                {/* 3. Genişletilmiş Yetkinlikler ve Deneyim */}
                <Typography variant="h6" fontWeight={700} color="primary">
                  Yetkinlikler & Deneyim
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <MultiValueInput
                      name="skills"
                      label="Yetenekler"
                      values={values}
                      handleChange={handleChange}
                      helperText="Örn: Java, Spring Boot, React"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MultiValueInput
                      name="languages"
                      label="Diller"
                      values={values}
                      handleChange={handleChange}
                      helperText="Örn: İngilizce (C1), Türkçe"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MultiValueInput
                      name="interests"
                      label="İlgi Alanları"
                      values={values}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MultiValueInput
                      name="certificates"
                      label="Sertifikalar"
                      values={values}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MultiValueInput
                      name="projects"
                      label="Projeler"
                      values={values}
                      handleChange={handleChange}
                    />
                  </Grid>
                </Grid>

                {/* Butonlar */}
                <Box display="flex" justifyContent="flex-end" gap={2} pt={2}>
                  <Button variant="outlined" color="inherit" onClick={() => navigate(-1)}>
                    Vazgeç
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ px: 6, py: 1, fontWeight: "bold" }}
                  >
                    {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
        </Formik>
      </Card>
    </Box>
  );
}
