import { SimpleCard } from "app/components";
import { useNavigate } from "react-router-dom";
import clubService from "app/services/clubService";
import ClubForm from "./ClubForm";
import { toast } from "react-toastify";

export default function ClubCreate() {

  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      const result = await clubService.createClub(formData);

      toast.success("Kulüp başarıyla oluşturuldu!");
      navigate("/clubs");

    } catch (error) {
      console.error("Kulüp oluşturulamadı:", error);

      if (error.response?.data?.errorDetail?.message) {
        toast.error(error.response.data.errorDetail.message);
      } else {
        toast.error("Beklenmeyen bir hata oluştu");
      }
    }
  };

  return (
    <SimpleCard title="Yeni Kulüp Oluştur">
      <ClubForm 
        initialValues={null}
        onSubmit={handleCreate}
        isEdit={false}
      />
    </SimpleCard>
  );
}
