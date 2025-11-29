import { Box } from "@mui/material";

const JustifyBox = ({ children, ...props }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    {...props}
  >
    {children}
  </Box>
);

export default JustifyBox;
