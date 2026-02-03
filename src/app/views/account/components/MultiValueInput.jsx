import { TextField } from "@mui/material";

const MultiValueInput = ({ name, label, values, handleChange, helperText }) => {
  // Array'i metne çevir (Görüntüleme için)
  const stringValue = Array.isArray(values[name]) ? values[name].join(", ") : "";

  // Metni array'e çevir (Backend'e göndermek için)
  const handleListChange = (e) => {
    const value = e.target.value;
    const arrayValue = value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

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
      value={stringValue}
      onChange={handleListChange}
      helperText={helperText}
      variant="outlined"
    />
  );
};

export default MultiValueInput;
