import { useEffect, useState } from "react";
import {
  Card,
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Chip,
  Tooltip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import eventService from "app/services/eventService";

const CardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: "20px 24px",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Title = styled("span")(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 700,
  "& th": {
    borderBottom: "1px solid " + theme.palette.divider,
    fontSize: "0.9rem",
    fontWeight: 600,
    background: theme.palette.action.hover,
  },
  "& td": {
    borderBottom: "1px solid " + theme.palette.divider,
    padding: "14px 10px",
    fontSize: "0.9rem",
  },
}));

export default function UpcomingEventsTable() {
  const [events, setEvents] = useState([]);

  const loadUpcomingEvents = async () => {
    try {
      const res = await eventService.getUpcomingEventsPaged({
        pageNumber: 0,
        pageSize: 10,
        columnName: "eventDate",
        asc: true,
      });

      setEvents(res?.payload?.content ?? []);
    } catch (err) {
      console.error("UPCOMING EVENTS ERROR:", err);
    }
  };

  useEffect(() => {
    loadUpcomingEvents();
  }, []);

  return (
    <Card elevation={3} sx={{ p: 0, mb: 3, borderRadius: 3 }}>
      <CardHeader>
        <Title>📅 Yaklaşan Etkinlikler</Title>
      </CardHeader>

      <Divider />

      <Box overflow="auto">
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Etkinlik</TableCell>
              <TableCell>Kulüpler</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Lokasyon</TableCell>
              <TableCell>Katılım</TableCell>
              <TableCell align="center">Aksiyon</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {events.map((e) => (
              <TableRow
                key={e.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.03)",
                    transition: "0.2s",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{e.title}</TableCell>

                <TableCell>
                  {e.clubs?.length > 0
                    ? e.clubs.map((c) => (
                        <Chip
                          key={c.id}
                          label={c.name}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    : "—"}
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {new Date(e.eventDate).toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>

                <TableCell>{e.location || "—"}</TableCell>

                <TableCell sx={{ fontWeight: 600 }}>
                  {e.participantCount}
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="Detay Göster">
                    <IconButton color="primary" size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Box>
    </Card>
  );
}
