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
  TablePagination,
  Tooltip,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

// ✅ YENİ: Member Servisi (Dosya yolunu kendi projene göre kontrol et)
import memberService from "../../services/memberService";

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

// Durum Renklendirmesi
const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return { label: "AKTİF", color: "success" };
    case "PASSIVE":
      return { label: "PASİF", color: "warning" };
    case "INCOMPLETED":
      return { label: "TAMAMLANMADI", color: "error" };
    default:
      return { label: status, color: "default" };
  }
};

/* ---------------- COMPONENT ---------------- */

export default function MemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  /* ---------- LOAD MEMBERS ---------- */

  const loadMembers = async () => {
    setLoading(true);
    try {
      // ✅ MemberService üzerinden çağırıyoruz
      const response = await memberService.getAllPaged({
        page: paginationModel.page,
        size: paginationModel.pageSize, // Backend 'size' parametresi bekliyorsa
        filter
      });

      // Backend yapına göre payload'ı al
      const data = response.data?.payload || response.payload;

      if (data) {
        setMembers(data.content);
        setTotalElements(data.totalElements);
      }
    } catch (e) {
      console.error(e);
      toast.error("Üye listesi yüklenemedi");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [paginationModel, filter]);

  /* ---------- FILTER ---------- */

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPaginationModel((p) => ({ ...p, page: 0 })); // Başa dön
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
          Üye Listesi Yönetimi
        </Typography>

        <TextField
          label="Ad, Soyad veya Öğrenci No Ara"
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
              <TableCell>Ad</TableCell>
              <TableCell>Soyad</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {loading ? (
              <StyledTableRow>
                <TableCell colSpan={6} align="center">
                  <Box py={3}>
                    <CircularProgress size={30} sx={{ color: yalovaRed }} />
                  </Box>
                </TableCell>
              </StyledTableRow>
            ) : members.length > 0 ? (
              members.map((m) => {
                const statusInfo = getStatusColor(m.status);
                return (
                  <StyledTableRow key={m.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{m.studentNumber}</TableCell>
                    <TableCell>{m.name}</TableCell>
                    <TableCell>{m.surname}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusInfo.label}
                        color={statusInfo.color}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700, minWidth: 90 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Tooltip title="Detay">
                          <IconButton
                            size="small"
                            sx={{ color: primaryDark }}
                            onClick={() => navigate(`/members/detail/${m.id}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Düzenle">
                          <IconButton
                            size="small"
                            sx={{ color: yalovaRed }}
                            onClick={() => navigate(`/members/edit/${m.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <TableCell colSpan={6} align="center">
                  <Typography py={3} color="text.secondary">
                    Kayıtlı üye bulunamadı.
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
        labelRowsPerPage="Sayfa başına:"
      />
    </Card>
  );
}
