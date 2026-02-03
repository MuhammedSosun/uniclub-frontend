import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const LEVEL_OPTIONS = ["Hazırlık", "1", "2", "3", "4"];

const AcademicInfo = ({ values, handleChange }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Fakülte"
        name="faculty"
        value={values.faculty}
        onChange={handleChange}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Bölüm"
        name="department"
        value={values.department}
        onChange={handleChange}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel>Sınıf</InputLabel>
        <Select name="level" value={values.level} label="Sınıf" onChange={handleChange}>
          {LEVEL_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}. Sınıf
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Öğrenci Numarası"
        name="studentNumber"
        value={values.studentNumber}
        onChange={handleChange}
      />
    </Grid>
  </Grid>
);

export default AcademicInfo;
