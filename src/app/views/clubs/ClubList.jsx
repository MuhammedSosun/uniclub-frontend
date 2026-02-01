import { useEffect, useState } from "react";
import { SimpleCard } from "app/components";
import { DataGrid } from "@mui/x-data-grid";
import clubService from "app/services/clubService";
import membershipService from "app/services/membershipsService";
import { Button, Stack, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ClubList() {
  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  });

  const navigate = useNavigate();

  // -----------------------
  // LOAD CLUBS
  // -----------------------
  const loadClubs = async () => {
    try {
      setLoading(true);

      const response = await clubService.getAllPaged({
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
        columnName: "clubName",
        asc: true,
        filter
      });

      const data = response.payload;

      setRows(
        data.content.map((club) => ({
          id: club.id,
          clubName: club.clubName,
          shortName: club.shortName,
          email: club.email,
          status: club.status, // ACTIVE / PASSIVE
          membershipStatus: club.membershipStatus // NOT_MEMBER | PENDING | APPROVED | REJECTED
        }))
      );
      console.log(data.content);

      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Kulüpler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, [paginationModel, filter]);

  // -----------------------
  // JOIN CLUB
  // -----------------------
  const handleJoinClub = async (clubId) => {
    try {
      await membershipService.requestJoin(clubId);

      // 🔥 Optimistic UI
      setRows((prev) =>
        prev.map((row) => (row.id === clubId ? { ...row, membershipStatus: "PENDING" } : row))
      );
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.payload?.message ||
        "Başvuru gönderilemedi";
      alert(msg);
    }
  };

  // -----------------------
  // HELPERS
  // -----------------------
  const getJoinButtonText = (row) => {
    switch (row.membershipStatus) {
      case "PENDING":
        return "Beklemede";
      case "APPROVED":
        return "Üyesin";
      case "REJECTED":
        return "Reddedildi";
      default:
        return "Katıl";
    }
  };

  const isJoinDisabled = (row) => {
    if (row.status !== "ACTIVE") return true;
    if (row.membershipStatus === "APPROVED") return true;
    if (row.membershipStatus === "PENDING") return true;
    return false; // NOT_MEMBER + REJECTED
  };

  const renderMembershipChip = (status) => {
    switch (status) {
      case "APPROVED":
        return <Chip label="Üye" color="success" size="small" />;
      case "PENDING":
        return <Chip label="Beklemede" color="warning" size="small" />;
      case "REJECTED":
        return <Chip label="Reddedildi" color="error" size="small" />;
      default:
        return <Chip label="Üye Değil" size="small" />;
    }
  };

  // -----------------------
  // COLUMNS
  // -----------------------
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "clubName", headerName: "Kulüp Adı", flex: 1 },
    { field: "shortName", headerName: "Kısa Ad", width: 150 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "status",
      headerName: "Kulüp Durumu",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "ACTIVE" ? "success" : "default"}
          size="small"
        />
      )
    },
    {
      field: "membershipStatus",
      headerName: "Üyelik",
      width: 150,
      renderCell: (params) => renderMembershipChip(params.value)
    },
    {
      field: "actions",
      headerName: "İşlemler",
      width: 360,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;

        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => navigate(`/clubs/detail/${row.id}`)}
            >
              Detay
            </Button>

            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={() => navigate(`/clubs/update/${row.id}`)}
            >
              Düzenle
            </Button>

            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={isJoinDisabled(row)}
              onClick={() => handleJoinClub(row.id)}
            >
              {getJoinButtonText(row)}
            </Button>
          </Stack>
        );
      }
    }
  ];

  // -----------------------
  // UI
  // -----------------------
  return (
    <SimpleCard title="Kulüp Listesi">
      <input
        type="text"
        placeholder="Kulüp adı veya kısa ad ile ara..."
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setPaginationModel((prev) => ({
            ...prev,
            page: 0
          }));
        }}
        style={{
          marginBottom: "12px",
          padding: "8px 12px",
          width: "300px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={totalElements}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          loading={loading}
        />
      </div>
    </SimpleCard>
  );
}
