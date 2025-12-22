import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Alert,
  // Yeni Bileşenler
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper // Bölüm başlıkları için
} from "@mui/material";

import memberService from "app/services/memberService";

// ---------------- YUP VALIDATION: Sosyal medya alanlarını ekledim ----------------
// Not: Listeler (skills, interests, vb.) metin olarak işlendiği için burada ayrıca doğrulanmadı.
const validationSchema = Yup.object({
  name: Yup.string().min(2, "Çok kısa").max(50, "Çok uzun"),
  surname: Yup.string().min(2, "Çok kısa").max(50, "Çok uzun"),
  age: Yup.number().min(15, "Yaş 15'ten küçük olamaz").max(80, "Yaş 80'den büyük olamaz").nullable(),
  studentNumber: Yup.string().matches(/^[0-9]{3,15}$/, {
    message: "3 ile 15 haneli sayı girin",
    excludeEmptyString: true
  }),
  faculty: Yup.string().max(100),
  department: Yup.string().max(100),
  level: Yup.string().oneOf(["Hazırlık", "1", "2", "3", "4"], "Geçerli bir sınıf seçin"),
  phone: Yup.string().matches(/^(\+\d{1,3})?\s?\d{10,12}$/, {
    message: "Geçerli bir telefon numarası girin",
    excludeEmptyString: true
  }),
  about: Yup.string().max(500),
  instagram: Yup.string().max(100),
  linkedIn: Yup.string().max(100),
  github: Yup.string().max(100),
  websiteUrl: Yup.string().max(100),
  xAccount: Yup.string().max(100),
});

// Üniversite seviyeleri için sabitler
const LEVEL_OPTIONS = ["Hazırlık", "1", "2", "3", "4"];


// ---------------- ANA BİLEŞEN ----------------
export default function Profile() {
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [memberStatus, setMemberStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null); // Form gönderim hatası

  // ---------------- LOAD PROFILE ---------------- (İŞ MANTIĞI KORUNDU)
  useEffect(() => {
    memberService
      .getMyProfile()
      .then((res) => {
        const data = res.payload;

        setInitialValues({
          // TEMEL
          name: data?.name ?? "",
          surname: data?.surname ?? "",
          age: data?.age ?? "",
          studentNumber: data?.studentNumber ?? "",
          faculty: data?.faculty ?? "",
          department: data?.department ?? "",
          level: data?.level ?? "",
          university: data?.university ?? "Yalova Üniversitesi",

          // İLETİŞİM
          phone: data?.phone ?? "",
          about: data?.about ?? "",
          profilePhotoPath: data?.profilePhotoPath ?? null,

          // SOSYAL
          instagram: data?.instagram ?? "",
          linkedIn: data?.linkedIn ?? "",
          github: data?.github ?? "",
          websiteUrl: data?.websiteUrl ?? "",
          xAccount: data?.xaccount ?? "",

          // LİSTELER (Dizi olarak saklanır)
          skills: data?.skills ?? [],
          interests: data?.interests ?? [],
          certificates: data?.certificates ?? [],
          languages: data?.languages ?? [],
          projects: data?.projects ?? [],

          // SİSTEM
          id: data?.id ?? null,
          status: data?.status ?? "INCOMPLETE"
        });

        setMemberStatus(data?.status);
      })
      .catch(() => setError("Profil bilgileri yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  // ---------------- YÜKLEME VE HATA EKRANLARI (İŞ MANTIĞI KORUNDU) ----------------
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!initialValues) return null;

  // ---------------- UI ----------------
  return (
    // UniClub Dashboard genişliğine uygun merkezleme
    <Box display="flex" justifyContent="center" py={4} px={2} sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <Card sx={{
        maxWidth: 1000, // Daha geniş form için maksimum genişlik artırıldı
        width: "100%",
        p: { xs: 3, sm: 5 },
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', // Hafif gölgelendirme
        borderRadius: 2
      }}>

        {/* BAŞLIK BÖLÜMÜ */}
        <Typography variant="h4" fontWeight={600} mb={1} color="primary.main">
          {memberStatus === "INCOMPLETE" ? "Profilini Tamamla" : "Profil Bilgilerini Güncelle"}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Kulüp üyelikleri ve etkinlikler için kişisel, akademik ve iletişim bilgilerini gir.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitError(null); // Yeni denemede hatayı temizle
            try {
              // memberService.updateMyProfile çağrısı
              await memberService.updateMyProfile(values);
              navigate("/dashboard/default");
            } catch (e) {
              setSubmitError("Profil güncellenirken bir hata oluştu. Lütfen bilgileri kontrol edin.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            errors,
            isSubmitting
          }) => (
            <form onSubmit={handleSubmit} noValidate>

              {/* Hata Mesajı Gösterme Alanı */}
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}

              {/* BÖLÜM 1: TEMEL KİŞİSEL BİLGİLER */}
              <SectionHeader title="1. Temel Kişisel Bilgiler ve Biyografi" />
              <Grid container spacing={3}> {/* spacing 3, daha geniş aralık sağlar */}

                {/* Ad, Soyad, Yaş */}
                <Grid item xs={12} sm={4}>
                  <StandardTextField
                    label="Adınız" name="name" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StandardTextField
                    label="Soyadınız" name="surname" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StandardTextField
                    label="Yaş" name="age" type="number" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>

                {/* Hakkımda Metni - Tam genişlik */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Hakkımda (Kısa Biyografi)"
                    name="about"
                    value={values.about}
                    onChange={handleChange}
                    placeholder="Kendinizden, ilgi alanlarınızdan ve kulübe katkılarınızdan bahsedin (Maks. 500 karakter)"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* BÖLÜM 2: AKADEMİK BİLGİLER */}
              <SectionHeader title="2. Akademik Bilgiler" />
              <Grid container spacing={3}>

                {/* Üniversite, Öğrenci No */}
                <Grid item xs={12} sm={6}>
                   {/* Üniversite adı değiştirilemeyeceği için sadece gösterilir */}
                  <TextField
                    fullWidth
                    label="Üniversite"
                    name="university"
                    value={values.university}
                    InputProps={{ readOnly: true }}
                    variant="filled" // Değiştirilemez olduğunu vurgular
                    sx={{ backgroundColor: '#f7f7f7' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StandardTextField
                    label="Öğrenci Numarası" name="studentNumber" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>

                {/* Fakülte, Bölüm */}
                <Grid item xs={12} sm={6}>
                  <StandardTextField
                    label="Fakülte" name="faculty" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StandardTextField
                    label="Bölüm" name="department" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>

                {/* Sınıf (Select Bileşeni ile) */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={touched.level && Boolean(errors.level)}>
                    <InputLabel id="level-label">Sınıf</InputLabel>
                    <Select
                      labelId="level-label"
                      label="Sınıf"
                      name="level"
                      value={values.level}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {LEVEL_OPTIONS.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.level && errors.level && (
                      <FormHelperText>{errors.level}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* Telefon Numarası, Akademik bilgilerle beraber gösterilebilir */}
                  <StandardTextField
                    label="Telefon Numarası" name="phone" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>

              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* BÖLÜM 3: SOSYAL MEDYA LİNKLERİ */}
              <SectionHeader title="3. Sosyal Medya ve İletişim Linkleri" />
              <Grid container spacing={3}>

                {/* LinkedIn, GitHub */}
                <Grid item xs={12} sm={6}>
                  <StandardTextField
                    label="LinkedIn Profil URL" name="linkedIn" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StandardTextField
                    label="GitHub Kullanıcı Adı veya URL" name="github" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>
                {/* Instagram, X, Website */}
                <Grid item xs={12} sm={6}>
                  <StandardTextField
                    label="Instagram Profil URL" name="instagram" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StandardTextField
                    label="X (Twitter) Profil URL" name="xAccount" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StandardTextField
                    label="Kişisel Website/Portfolyo URL" name="websiteUrl" values={values} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* BÖLÜM 4: YETENEK & İLGİ ALANLARI (Liste Girişleri) */}
              <SectionHeader title="4. Yetenekler, Projeler ve Sertifikalar" />
              <Grid container spacing={3}>

                {/* Yetenekler */}
                <Grid item xs={12} sm={6}>
                  <ListTextField
                    name="skills"
                    label="Yetenekler (virgülle ayırın)"
                    values={values}
                    handleChange={handleChange}
                    helperText="Örn: React, JavaScript, Python, Figma"
                  />
                </Grid>
                {/* İlgi Alanları */}
                <Grid item xs={12} sm={6}>
                  <ListTextField
                    name="interests"
                    label="İlgi Alanları (virgülle ayırın)"
                    values={values}
                    handleChange={handleChange}
                    helperText="Örn: Yapay Zeka, Oyun Geliştirme, Doğa Sporları"
                  />
                </Grid>

                {/* Sertifikalar */}
                <Grid item xs={12} sm={6}>
                  <ListTextField
                    name="certificates"
                    label="Sertifikalar (virgülle ayırın)"
                    values={values}
                    handleChange={handleChange}
                    helperText="Örn: Google Analytics Sertifikası, AWS Cloud Practitioner"
                  />
                </Grid>
                {/* Diller */}
                <Grid item xs={12} sm={6}>
                  <ListTextField
                    name="languages"
                    label="Bildiğiniz Diller (virgülle ayırın)"
                    values={values}
                    handleChange={handleChange}
                    helperText="Örn: İngilizce (B2), Almanca (A1), Türkçe (Anadil)"
                  />
                </Grid>
                {/* Projeler */}
                <Grid item xs={12}> {/* Tam genişlik verilmiştir */}
                  <ListTextField
                    name="projects"
                    label="Projeler (virgülle ayırın)"
                    values={values}
                    handleChange={handleChange}
                    helperText="Lütfen sadece proje adlarını veya kısa açıklamalarını girin. Detaylar için özel sayfa kullanılmalı."
                  />
                </Grid>
              </Grid>


              {/* KAYDETME BUTONLARI */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={5}
              >
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => navigate("/dashboard/default")}
                >
                  Şimdi Atla / İptal Et
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large" // Daha belirgin buton
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />} // Yükleniyor animasyonu
                >
                  {isSubmitting ? "Kaydediliyor..." : "Kaydet ve Devam Et"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
}

// ---------------- YARDIMCI BİLEŞENLER ----------------

// 1. Bölüm Başlığı Bileşeni (UniClub stilinde)
const SectionHeader = ({ title }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      mb: 3,
      backgroundColor: '#e3f2fd', // Hafif mavi arkaplan (primary.light benzeri)
      borderLeft: '4px solid #1976d2', // Sol kenarda UniClub mavi çizgisi (primary.main)
      borderRadius: 1
    }}
  >
    <Typography variant="h6" fontWeight={500} color="#1976d2">
      {title}
    </Typography>
  </Paper>
);

// 2. Formik'e Entegre Standart TextField
// Tekrar eden temel alanlar için yardımcı bileşen
const StandardTextField = ({ label, name, values, handleChange, handleBlur, touched, errors, type = "text" }) => (
  <TextField
    fullWidth
    label={label}
    name={name}
    type={type}
    value={values[name]}
    onChange={handleChange}
    onBlur={handleBlur}
    error={touched[name] && Boolean(errors[name])}
    helperText={touched[name] && errors[name]}
    variant="outlined" // Şık ve modern standart stil
  />
);

// 3. Formik'e Entegre Liste TextField (Virgül ile Diziye Dönüştürme)
const ListTextField = ({ label, name, values, handleChange, helperText }) => {
    // Liste verilerini Formik'in dizi formatından, metin kutusunda görünmesi için virgülle ayrılmış stringe dönüştürür.
    const stringValue = Array.isArray(values[name]) ? values[name].join(", ") : "";

    // Metin kutusuna yazılan virgülle ayrılmış metni, Formik'in state'inde dizi olarak günceller.
    const handleListChange = (e) => {
        const value = e.target.value;
        const arrayValue = value.split(',').map(v => v.trim()).filter(v => v.length > 0);

        handleChange({
            target: {
                name: name,
                value: arrayValue
            }
        });
    };

    return (
        <TextField
            fullWidth
            label={label}
            name={name}
            value={stringValue}
            onChange={handleListChange}
            helperText={helperText}
            variant="outlined"
        />
    );
}