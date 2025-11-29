import { lazy } from "react";

const ClubList = lazy(() => import("./ClubList"));
const ClubCreate = lazy(() => import("./ClubCreate"));
const ClubUpdate = lazy(() => import("./ClubUpdate"));
const ClubDetail = lazy(() => import("./ClubDetail"));   // EKLENDİ

const ClubRoutes = [
  { path: "/clubs", element: <ClubList /> },
  { path: "/clubs/create", element: <ClubCreate /> },
  { path: "/clubs/update/:id", element: <ClubUpdate /> },
  { path: "/clubs/detail/:id", element: <ClubDetail /> },  // EKLENDİ
];

export default ClubRoutes;
