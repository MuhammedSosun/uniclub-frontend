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
  CircularProgress,
  TableContainer,
  Button,
  TablePagination
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";

// ✅ PAGED backend servisi
import { getUsersPaged } from "../../services/userService";

const yalovaRed = "#B00020";
const primaryDark = "#1A2038";

/* ---------------- STYLES ---------------- */

const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: primaryDark,
  "& .MuiTableCell-root": {
    color: yalovaRed,
    fontWeight: 700,
    fontSize: "0.9rem",
    borderBottom: `2px solid ${yalovaRed}`,
    textTransform: "uppercase"
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:hover": {
    backgroundColor: "rgba(176, 0, 32, 0.1)"
  }
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

/* ---------------- COMPONENT ---------------- */

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  /* ---------- LOAD USERS ---------- */

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersPaged({
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
        columnName: "id",
        asc: true,
        filter
      });

      setUsers(response.payload.content);
      setTotalElements(response.payload.totalElements);
    } catch (e) {
      toast.error("Kullanıcılar yüklenemedi");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [paginationModel, filter]);

  /* ---------- FILTER ---------- */

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPaginationModel((p) => ({ ...p, page: 0 })); // 🔑 başa dön
  };

  /* ---------------- RENDER ---------------- */

  return (
    <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 6 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2
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
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
          sx={{ minWidth: { sm: 300, xs: "100%" } }}
        />
      </Box>

      {/* TABLE */}
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
                          minWidth: 110
                        }}
                      />
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: yalovaRed,
                          color: yalovaRed
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

      {/* PAGINATION */}
      <TablePagination
        component="div"
        count={totalElements}
        page={paginationModel.page}
        rowsPerPage={paginationModel.pageSize}
        onPageChange={(_, newPage) => setPaginationModel((p) => ({ ...p, page: newPage }))}
        onRowsPerPageChange={(e) =>
          setPaginationModel({
            page: 0,
            pageSize: parseInt(e.target.value, 10)
          })
        }
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
    </Card>
  );
}
