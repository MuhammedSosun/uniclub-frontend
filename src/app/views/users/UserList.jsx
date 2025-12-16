import { useEffect, useState } from "react";
import {
  Card,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Chip,
  useTheme,
  CircularProgress,
  TableContainer,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";

// Backend servisler
import { getAllUsers, searchUsers } from "../../services/userService";

const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: primaryDark,
  "& .MuiTableCell-root": {
    color: yalovaRed,
    fontWeight: 700,
    fontSize: "0.9rem",
    borderBottom: `2px solid ${yalovaRed}`,
    textTransform: "uppercase",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.3s",
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "rgba(176, 0, 32, 0.1)",
  },
}));

const getRoleColor = (role) => {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return { label: "YÖNETİCİ", bgColor: "#FFCDD2" };
    case "CLUB_MANAGER":
      return { label: "KULÜP BAŞKANI", bgColor: "#BBDEFB" };
    default:
      return { label: "ÖĞRENCİ ÜYE", bgColor: "#f0f0f0" };
  }
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.payload ?? []);  // RootEntity.data
    } catch (err) {
      toast.error("Kullanıcılar yüklenirken hata oluştu!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (e) => {
    const value = e.target.value;
    setFilter(value);

    setLoading(true);
    try {
      if (value.trim() === "") {
        loadUsers();
        return;
      }

      const response = await searchUsers(value);
      setUsers(response.payload ?? []);
    } catch (err) {
      toast.error("Arama yapılırken hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: primaryDark, display: "flex", alignItems: "center" }}
        >
          <GroupIcon sx={{ mr: 1, color: yalovaRed }} />
          Kullanıcı Listesi Yönetimi
        </Typography>

        <TextField
          label="Öğrenci No veya E-posta ile Ara"
          value={filter}
          onChange={handleFilterChange}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ minWidth: { sm: 300, xs: "100%" } }}
        />
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <TableCell>Öğrenci No</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Kayıt Tarihi</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {loading ? (
              <StyledTableRow>
                <TableCell colSpan={5} align="center">
                  <Box py={3}>
                    <CircularProgress size={30} sx={{ color: yalovaRed }} />
                  </Box>
                </TableCell>
              </StyledTableRow>
            ) : users.length > 0 ? (
              users.map((u) => {
                const roleInfo = getRoleColor(u.role);
                return (
                  <StyledTableRow key={u.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={roleInfo.label}
                        size="small"
                        sx={{
                          backgroundColor: roleInfo.bgColor,
                          color: primaryDark,
                          fontWeight: 700,
                          minWidth: 110,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: yalovaRed,
                          color: yalovaRed,
                          "&:hover": {
                            backgroundColor: "rgba(176, 0, 32, 0.05)",
                          },
                        }}
                      >
                        Görüntüle
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <TableCell colSpan={5} align="center">
                  <Typography py={3} color="text.secondary">
                    Kullanıcı bulunamadı.
                  </Typography>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
