import React, { Suspense } from "react";

const Loadable = (Component) => (props) => (
  <Suspense
    fallback={
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <h2>Yükleniyor...</h2>
      </div>
    }
  >
    <Component {...props} />
  </Suspense>
);

export default Loadable;
