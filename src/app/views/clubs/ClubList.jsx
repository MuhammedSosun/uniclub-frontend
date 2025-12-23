import { useEffect, useState } from "react";
import { SimpleCard } from "app/components";
import { DataGrid } from "@mui/x-data-grid";
import clubService from "app/services/clubService";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import membershipService from "app/services/membershipsService";
import { Tooltip } from "@mui/material";



export default function ClubList() {
    const [rows, setRows] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");   // 🔥 Arama filtresi

    const navigate = useNavigate();

    const loadClubs = async () => {
        try {
            setLoading(true);

            const response = await clubService.getAllPaged({
                pageNumber,
                pageSize,
                columnName: "clubName",
                asc: true,
                filter,   // 🔥 Arama burada gönderiliyor
            });

            const data = response.payload;

            setRows(
                data.content.map((club) => ({
                    id: club.id,
                    clubName: club.clubName,
                    shortName: club.shortName,
                    email: club.email,
                    status: club.status,
                }))
            );

            setTotalElements(data.totalElements);

        } catch (error) {
            console.error("Kulüpler yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleJoinClub = async (clubId, status) => {
        if(status !== "ACTIVE"){
        alert("Bu kulüp aktif değil, başvuru gönderemezsin.");
        return;
        }
        try {
        await membershipService.requestJoin(clubId);
        alert("Başvuru gönderildi ✅ (Admin onayı bekleniyor)");
    } catch (error) {
        console.error("Join request hata:", error);
        const msg =
            error?.response?.data?.message ||
            error?.response?.data?.payload?.message || // bazı yapılarda buradan gelir
            "Başvuru gönderilemedi";
        alert(msg);
    }
    };

    useEffect(() => {
        loadClubs();
    }, [pageNumber, pageSize, filter]); // 🔥 Arama değişince yenile

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "clubName", headerName: "Kulüp Adı", flex: 1 },
        { field: "shortName", headerName: "Kısa Ad", width: 150 },
        { field: "email", headerName: "Email", flex: 1 },
        {
            field: "status",
            headerName: "Durum",
            width: 150,
            renderCell: (params) => (
                <span
                    style={{
                        color: params.value === "ACTIVE" ? "green" : "red",
                        fontWeight: "bold",
                    }}
                >
                    {params.value}
                </span>
            ),
        },
        {
    field: "actions",
    headerName: "İşlemler",
    width: 340,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
        <Stack direction="row" spacing={1}>
            <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate(`/clubs/detail/${params.row.id}`)}
            >
                Detay
            </Button>

            <Button
                variant="contained"
                color="warning"
                size="small"
                onClick={() => navigate(`/clubs/update/${params.row.id}`)}
            >
                Düzenle
            </Button>

            <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => alert("Silme fonksiyonu eklenecek")}
            >
                Sil
            </Button>

            {/* ✅ Yeni: Kulübe Katıl */}
            <Button
                variant="contained"
                color="success"
                size="small"
                disabled={params.row.status !== "ACTIVE"}
                onClick={() => handleJoinClub(params.row.id, params.row.status)}
            >
                Katıl
            </Button>
        </Stack>
    ),
},
    ];

    return (
        <SimpleCard title="Kulüp Listesi">
            {/* 🔥 Arama Inputu */}
            <input
                type="text"
                placeholder="Kulüp adı veya kısa ad ile ara..."
                value={filter}
                onChange={(e) => {
                    setFilter(e.target.value);
                    setPageNumber(0);
                }}
                style={{
                    marginBottom: "12px",
                    padding: "8px 12px",
                    width: "300px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                }}
            />

            <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    page={pageNumber}
                    pageSize={pageSize}
                    rowCount={totalElements}
                    paginationMode="server"
                    onPageChange={(newPage) => setPageNumber(newPage)}
                    onPageSizeChange={(newSize) => setPageSize(newSize)}
                    pagination
                    loading={loading}
                />
            </div>
        </SimpleCard>
    );
}
