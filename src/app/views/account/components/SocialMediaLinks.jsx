import { Grid, TextField } from "@mui/material";

const SocialMediaLinks = ({ values, handleChange }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="LinkedIn"
        name="linkedIn"
        value={values.linkedIn}
        onChange={handleChange}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="GitHub"
        name="github"
        value={values.github}
        onChange={handleChange}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Portfolyo / Web Sitesi"
        name="websiteUrl"
        value={values.websiteUrl}
        onChange={handleChange}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Telefon"
        name="phone"
        value={values.phone}
        onChange={handleChange}
      />
    </Grid>
  </Grid>
);

export default SocialMediaLinks;
