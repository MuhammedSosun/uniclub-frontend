import { SimpleCard } from "app/components";
import { useNavigate } from "react-router-dom";
import clubService from "app/services/clubService";
import ClubForm from "./ClubForm";
import { toast } from "react-toastify";

export default function ClubCreate() {
  const navigate = useNavigate();

  const handleCreate = async (formData, logoFile) => {
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
  };

  return (
    <SimpleCard title="Yeni Kulüp Oluştur">
      <ClubForm initialValues={null} onSubmit={handleCreate} isEdit={false} />
    </SimpleCard>
  );
}
