import { useState, useEffect } from "react";
import memberService from "app/services/memberService";

export const useProfile = () => {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await memberService.getMyProfile();
      const data = res.payload || res;

      setInitialValues({
        id: data?.id ?? null,
        status: data?.status ?? "INCOMPLETE",
        name: data?.name ?? "",
        surname: data?.surname ?? "",
        age: data?.age ?? "",
        studentNumber: data?.studentNumber ?? "",
        faculty: data?.faculty ?? "",
        department: data?.department ?? "",
        level: data?.level ?? "",
        university: data?.university ?? "Yalova Üniversitesi",
        phone: data?.phone ?? "",
        email: data?.email ?? "",
        username: data?.username ?? "",
        profilePhotoPath: data?.profilePhotoPath ?? null,
        about: data?.about ?? "",

        // Sosyal Medya (Backend 'xaccount' olarak dönüyor)
        instagram: data?.instagram ?? "",
        linkedIn: data?.linkedIn ?? "",
        xAccount: data?.xaccount ?? "",
        github: data?.github ?? "",
        websiteUrl: data?.websiteUrl ?? "",

        // Tüm Listeler (Backend DTO tam uyum)
        skills: data?.skills ?? [],
        interests: data?.interests ?? [],
        certificates: data?.certificates ?? [],
        languages: data?.languages ?? [],
        projects: data?.projects ?? [],

        // Yetki ve Kulüp Bilgileri (ReadOnly olsa da state'de tutulur)
        canCreateEvent: data?.canCreateEvent ?? false,
        clubNames: data?.clubNames ?? [],
        participatedEventTitles: data?.participatedEventTitles ?? []
      });
    } catch (err) {
      setError("Profil verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { initialValues, loading, error, refetch: fetchProfile };
};
