import { useEffect, useState } from "react";
import { TextField, Button, Grid, MenuItem, Stack } from "@mui/material";

export default function ClubForm({ initialValues, onSubmit, isEdit }) {
  
  const [formData, setFormData] = useState({
    clubName: "",
    shortName: "",
    description: "",
    logoUrl: "",
    foundationDate: "",
    email: "",
    phone: "",
    instagram: "",
    approved: false,
    status: "Active",
    presidentId: ""
  });

  // initialValues varsa (update ekranında) formu doldurur
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // parent'a gönderiyoruz
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Kulüp Adı"
            name="clubName"
            value={formData.clubName}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Kısa Ad"
            name="shortName"
            value={formData.shortName}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Açıklama"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Logo URL"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Kuruluş Tarihi"
            name="foundationDate"
            InputLabelProps={{ shrink: true }}
            value={formData.foundationDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="E-posta"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Telefon"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+90555..."
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
          />
        </Grid>

        {/* Approved */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Onay Durumu"
            name="approved"
            value={formData.approved}
            onChange={handleChange}
          >
            <MenuItem value={true}>Onaylı</MenuItem>
            <MenuItem value={false}>Onaysız</MenuItem>
          </TextField>
        </Grid>

        {/* Status */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
            <MenuItem value="Terminated">Terminated</MenuItem>
            <MenuItem value="Private">Private</MenuItem>
          </TextField>
        </Grid>

      </Grid>

      <Stack direction="row" justifyContent="flex-end" mt={3}>
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? "Güncelle" : "Kaydet"}
        </Button>
      </Stack>
    </form>
  );
}
