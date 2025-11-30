import React, { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

/**
 * Loadable Yüksek Dereceden Bileşeni (HOC)
 * * Bu bileşen, tembel yüklenen (lazy loaded) React bileşenlerini sarmalar.
 * Bileşen yüklenene kadar merkezlenmiş ve profesyonel bir yükleyici (spinner) gösterir.
 * Matx şablonunun lazy loading yapısını korur ve geliştirir.
 *
 * @param {React.Component} Component - Tembel yüklenecek React bileşeni.
 * @returns {React.Component} - Yükleyici geri dönüşü ile sarılmış bileşen.
 */
const Loadable = (Component) => (props) => (
  <Suspense
    fallback={
      // Yükleniyor ekranı için merkezi, tam ekran ve profesyonel bir stil
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Tam viewport yüksekliği
          width: "100%",
          flexDirection: "column",
          backgroundColor: "background.default", // Tema rengiyle uyumlu arka plan
          p: 4,
        }}
      >
        {/* Yükleniyor Çarkı (CircularProgress) */}
        <CircularProgress 
          color="primary" 
          size={50}
          thickness={5}
        />
        {/* Yükleniyor metni */}
        <Box mt={2}>
            <p style={{ color: '#777', margin: 0 }}>
                Modül yükleniyor... Lütfen bekleyiniz.
            </p>
        </Box>
      </Box>
    }
  >
    <Component {...props} />
  </Suspense>
);

export default Loadable;