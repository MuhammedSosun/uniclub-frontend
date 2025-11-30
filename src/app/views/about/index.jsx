import React from "react";

const About = () => {
  return (
    <div style={{
      padding: "40px",
      maxWidth: "900px",
      margin: "0 auto",
      fontFamily: "Inter, sans-serif",
    }}>
      <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "16px" }}>
        Hakkımızda
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.7", opacity: 0.85 }}>
        UniClub Platformu, üniversite kulüplerini tek bir çatı altında toplamak,
        etkinliklerin daha kolay yönetilmesini sağlamak ve öğrenciler arasındaki
        iletişimi güçlendirmek amacıyla geliştirilmiş modern bir yönetim sistemidir.
        Üniversite kulüplerinin dijital ortamda daha görünür, daha ulaşılabilir
        ve daha düzenli bir yapıya kavuşmasını hedefliyoruz.
      </p>

      <h2 style={{ marginTop: "32px", fontSize: "28px", fontWeight: "600" }}>
        Misyonumuz
      </h2>
      <p style={{ fontSize: "17px", lineHeight: "1.7", opacity: 0.85 }}>
        Üniversite kulüplerinin yönetim süreçlerini kolaylaştırmak, öğrencilere daha
        verimli bir kulüp deneyimi sunmak ve etkinlik planlama süreçlerini profesyonel
        bir hale getirmek.  
        Teknolojiyi öğrenci yaşamına entegre ederek herkes için daha erişilebilir bir
        platform oluşturmayı amaçlıyoruz.
      </p>

      <h2 style={{ marginTop: "32px", fontSize: "28px", fontWeight: "600" }}>
        Vizyonumuz
      </h2>
      <p style={{ fontSize: "17px", lineHeight: "1.7", opacity: 0.85 }}>
        Türkiye’deki tüm üniversite kulüplerinin aktif olarak kullandığı, öğrenci
        topluluklarını bir araya getiren yenilikçi bir platform olmak.  
        Uzun vadede, öğrenci etkinlik yönetiminde ulusal bir standart oluşturmayı
        ve dünya genelindeki eğitim kurumlarına açılmayı hedefliyoruz.
      </p>

      <h2 style={{ marginTop: "32px", fontSize: "28px", fontWeight: "600" }}>
        Değerlerimiz
      </h2>
      <ul style={{ fontSize: "17px", lineHeight: "1.8", opacity: 0.85 }}>
        <li>💡 Yenilikçilik: Sürekli gelişen teknolojileri platforma entegre ederiz.</li>
        <li>🤝 İşbirliği: Öğrenciler, kulüpler ve üniversitelerle ortak ilerleriz.</li>
        <li>📌 Şeffaflık: Tüm süreçleri açık, anlaşılır ve izlenebilir tutarız.</li>
        <li>🚀 Gelişim: Öğrencilerin kendini geliştirebileceği bir ortam sunarız.</li>
      </ul>

      <h2 style={{ marginTop: "32px", fontSize: "28px", fontWeight: "600" }}>
        İletişim
      </h2>
      <p style={{ fontSize: "17px", lineHeight: "1.7", opacity: 0.85 }}>
        Her türlü soru, öneri veya işbirliği talebiniz için bizimle iletişime geçebilirsiniz:  
        <strong>uniclub@support.com</strong>
      </p>
    </div>
  );
};

export default About;
