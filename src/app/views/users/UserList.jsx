import { useEffect, useState } from "react";
import {
  Card,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { getAllUsers } from "app/services/userService";
import { toast } from "react-toastify";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      // 🔥 backend response payload formatına göre:
      setUsers(data.payload || data || []); 
    } catch (err) {
      toast.error("Kullanıcılar yüklenirken hata oluştu!");
    }
  };

  const handleFilterChange = async (e) => {
    const value = e.target.value;
    setFilter(value);

    try {
      const data = await getAllUsers(value);
      // 🔥 burada da payload kontrolü:
      setUsers(data.payload || data || []);
    } catch (err) {
      toast.error("Filtreleme sırasında hata oluştu!");
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <h2>Kullanıcı Listesi</h2>

      <TextField
        label="Öğrenci Numarası veya E-posta ile Ara"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Öğrenci No</TableCell>
            <TableCell>E-posta</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Kayıt Tarihi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Kullanıcı bulunamadı.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
