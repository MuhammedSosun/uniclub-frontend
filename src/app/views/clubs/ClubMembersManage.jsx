import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Tabs, Tab, Button, Chip, Stack, MenuItem, Select, Switch } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { SimpleCard } from "app/components";
import membershipService from "../../services/membershipsService";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import { toast } from "react-toastify";

export default function ClubMembersManage() {
  // 🔥 DÜZELTME BURADA YAPILDI:
  // URL parametresi bazen 'id' bazen 'clubId' olarak gelebilir.
  // params objesini alıp ikisini de kontrol ediyoruz.
  const params = useParams();
  const clubId = params.id || params.clubId;

  console.log("🛑 [DEBUG] URL Parametreleri:", params);
  console.log("🛑 [DEBUG] Algılanan Club ID:", clubId);

  const [tabIndex, setTabIndex] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeMembers, setActiveMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ------------------------------------------------
  // 1. VERİLERİ YÜKLEME (BEKLEYENLER VE ÜYELER)
  // ------------------------------------------------
  const loadData = async () => {
    // 1. Kulüp ID kontrolü
    if (!clubId) {
      console.error("❌ HATA: Club ID (URL parametresi) okunamadı! Router ayarlarını kontrol et.");
      return;
    }

    setLoading(true);
    try {
      // -------------------------------------------
      // 1️⃣ BEKLEYENLERİ ÇEK
      // -------------------------------------------
      const resPending = await membershipService.pendingRequests(clubId);

      console.log("🛑 [DEBUG] Ham Backend Yanıtı (Pending):", resPending);

      // Backend veri yapısına uygun karşılama
      const pendingList = resPending.data?.payload || resPending.payload || [];

      console.log("✅ [DEBUG] Yakalanan Bekleyen Listesi:", pendingList);

      const mappedPending = pendingList.map((item) => ({
        ...item,
        id: item.memberId // DataGrid için unique ID
      }));

      setPendingRequests(mappedPending);

      // -------------------------------------------
      // 2️⃣ ONAYLI ÜYELERİ ÇEK
      // -------------------------------------------
      const resMembers = await membershipService.getApprovedMembers(clubId);
      const memberList = resMembers.data?.payload || resMembers.payload || [];

      const mappedMembers = memberList.map((item) => ({
        ...item,
        id: item.memberId // DataGrid için unique ID
      }));

      setActiveMembers(mappedMembers);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
      toast.error("Liste yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clubId]);

  // ------------------------------------------------
  // 2. AKSİYONLAR (ONAYLA / REDDET)
  // ------------------------------------------------
  const handleApprove = async (memberId) => {
    try {
      await membershipService.approve(clubId, memberId);
      toast.success("Üyelik onaylandı!");
      loadData(); // Listeyi yenile
    } catch (error) {
      console.error("Onay hatası:", error);
      toast.error("Onaylama işlemi başarısız.");
    }
  };

  const handleReject = async (memberId) => {
    if (!window.confirm("Bu isteği reddetmek istediğinize emin misiniz?")) return;
    try {
      await membershipService.reject(clubId, memberId);
      toast.warning("Üyelik isteği reddedildi.");
      loadData(); // Listeyi yenile
    } catch (error) {
      console.error("Red hatası:", error);
      toast.error("İşlem başarısız.");
    }
  };

  const handleRoleUpdate = async (memberId, newRole) => {
    try {
      await membershipService.updateMemberRole(clubId, memberId, newRole);
      toast.success("Rol güncellendi");
      setActiveMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
    } catch (error) {
      toast.error("Rol güncellenemedi");
    }
  };

  const handleStatusUpdate = async (memberId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "PASSIVE" : "ACTIVE";
    try {
      await membershipService.updateMemberStatus(clubId, memberId, newStatus);
      toast.success(`Kullanıcı durumu: ${newStatus}`);
      setActiveMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
      );
    } catch (error) {
      toast.error("Durum güncellenemedi");
    }
  };

  // ------------------------------------------------
  // 3. TABLO SÜTUN TANIMLARI
  // ------------------------------------------------

  const columnsPending = [
    { field: "name", headerName: "Ad", flex: 1 },
    { field: "surname", headerName: "Soyad", flex: 1 },
    { field: "studentNumber", headerName: "Öğrenci No", width: 150 },
    {
      field: "actions",
      headerName: "İşlemler",
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleApprove(params.row.id)}
          >
            Onayla
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<CancelIcon />}
            onClick={() => handleReject(params.row.id)}
          >
            Reddet
          </Button>
        </Stack>
      )
    }
  ];

  const columnsMembers = [
    { field: "name", headerName: "Ad", flex: 1 },
    { field: "surname", headerName: "Soyad", flex: 1 },
    {
      field: "role",
      headerName: "Rol",
      width: 200,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.value || "MEMBER"}
          onChange={(e) => handleRoleUpdate(params.row.id, e.target.value)}
          sx={{ fontSize: "0.85rem", height: 35 }}
        >
          <MenuItem value="PRESIDENT">Başkan</MenuItem>
          <MenuItem value="VICE_PRESIDENT">Başkan Yrd.</MenuItem>
          <MenuItem value="BOARD_MEMBER">Yönetim Kurulu</MenuItem>
          <MenuItem value="MEMBER">Üye</MenuItem>
        </Select>
      )
    },
    {
      field: "status",
      headerName: "Aktiflik",
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={params.value === "ACTIVE"}
          color="success"
          onChange={() => handleStatusUpdate(params.row.id, params.value)}
        />
      )
    }
  ];

  return (
    <SimpleCard title="Üye Yönetim Merkezi">
      <Box sx={{ width: "100%" }}>
        {/* TAB MENÜSÜ */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tabIndex} onChange={(_, newVal) => setTabIndex(newVal)}>
            <Tab
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon />
                  Bekleyen İstekler
                  {pendingRequests.length > 0 && (
                    <Chip label={pendingRequests.length} color="error" size="small" />
                  )}
                </Box>
              }
            />
            <Tab label={`Onaylı Üyeler (${activeMembers.length})`} />
          </Tabs>
        </Box>

        {/* 1. TAB: BEKLEYEN İSTEKLER */}
        {tabIndex === 0 && (
          <Box sx={{ height: 400, width: "100%" }}>
            {pendingRequests.length === 0 && !loading ? (
              <Box p={4} textAlign="center" color="text.secondary">
                Şu an bekleyen üyelik isteği yok.
              </Box>
            ) : (
              <DataGrid
                rows={pendingRequests}
                columns={columnsPending}
                loading={loading}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                disableSelectionOnClick
              />
            )}
          </Box>
        )}

        {/* 2. TAB: ONAYLI ÜYELER */}
        {tabIndex === 1 && (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={activeMembers}
              columns={columnsMembers}
              loading={loading}
              pageSize={10}
              rowsPerPageOptions={[10, 20]}
              disableSelectionOnClick
            />
          </Box>
        )}
      </Box>
    </SimpleCard>
  );
}
