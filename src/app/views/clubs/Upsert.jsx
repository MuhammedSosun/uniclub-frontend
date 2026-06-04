import { SimpleCard } from "app/components";
import { useNavigate, useSearchParams } from "react-router-dom";
import clubService from "app/services/clubService";
import ClubForm from "./ClubForm";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function ClubUpsert() {
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const id = params.get("id");
  console.log(id);

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

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
        presidentId: data.presidentId || null
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
    id && loadClub();
    !id && setLoading(false);
    !id && setInitialValues(null);
  }, [id]);

  const handleCreate = async (formData, logoFile) => {
    if (id) {
      try {
        const result = await clubService.updateClub(id, formData);
        console.log(result);
        toast.success("Kulüp başarıyla güncellendi!");
        navigate("/clubs");
      } catch (error) {
        console.error("Kulüp güncellenemedi:", error);
        toast.error("Beklenmeyen bir hata oluştu");
      }
      return;
    } else {
      try {
        // 1️⃣ Kulübü oluştur

        const result = await clubService.createClub(formData);
        const clubId = result.payload.id;

        // 2️⃣ Logo varsa upload et
        if (logoFile) {
          const reader = new FileReader();

          reader.onload = async () => {
            const base64 = reader.result.split(",")[1];

            await clubService.uploadLogoBase64({
              clubId,
              fileName: logoFile.name,
              base64Content: base64
            });
          };

          reader.readAsDataURL(logoFile);
        }

        toast.success("Kulüp başarıyla oluşturuldu!");
        navigate("/clubs");
      } catch (error) {
        console.error("Kulüp oluşturulamadı:", error);
        toast.error("Beklenmeyen bir hata oluştu");
      }
    }
  };
  if (loading) {
    return <SimpleCard title="Kulüp Düzenle">Yükleniyor...</SimpleCard>;
  }
  return (
    <SimpleCard title="Yeni Kulüp Oluştur">
      <ClubForm initialValues={id ? initialValues : null} onSubmit={handleCreate} isEdit={!!id} />
    </SimpleCard>
  );
}
