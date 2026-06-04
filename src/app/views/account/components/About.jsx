import { Grid, TextField } from "@mui/material";

export default function About({ values, handleChange }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField fullWidth label="Ad" name="name" value={values.name} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Soyad"
          name="surname"
          value={values.surname}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField fullWidth label="Yaş" name="age" value={values.age} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Hakkımda"
          name="about"
          value={values.about}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}
