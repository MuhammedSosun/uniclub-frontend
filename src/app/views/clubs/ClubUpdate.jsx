import { useEffect, useState } from "react";
import { SimpleCard } from "app/components";
import { useNavigate, useParams } from "react-router-dom";
import clubService from "app/services/clubService";
import ClubForm from "./ClubForm";
import { toast } from "react-toastify";

export default function ClubUpdate() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Kulüp detayını çek ---
  const loadClub = async () => {
    try {
      const response = await clubService.getClubById(id);
      const data = response.payload;

      setInitialValues({
        clubName: data.clubName,
        shortName: data.shortName,
        description: data.description,
        logoUrl: data.logoUrl,
        foundationDate: data.foundationDate,
        email: data.email,
        phone: data.phone,
        instagram: data.instagram,
        approved: data.approved,
        status: data.status,
        presidentId: data.presidentId || null,
      });

    } catch (error) {
      console.error(error);
      toast.error("Kulüp bilgileri yüklenemedi");
      navigate("/clubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClub();
  }, []);

  // --- Güncelleme işlemi ---
  const handleUpdate = async (formData) => {
    try {
      await clubService.updateClub(id, formData);
      toast.success("Kulüp başarıyla güncellendi!");
      navigate("/clubs");

    } catch (error) {
      console.error(error);
      toast.error("Güncelleme sırasında hata oluştu");
    }
  };

  if (loading) {
    return <SimpleCard title="Kulüp Düzenle">Yükleniyor...</SimpleCard>;
  }

  return (
    <SimpleCard title="Kulüp Düzenle">
      <ClubForm 
        initialValues={initialValues}
        onSubmit={handleUpdate}
        isEdit={true}
      />
    </SimpleCard>
  );
}
