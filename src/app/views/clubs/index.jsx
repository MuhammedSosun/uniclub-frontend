import { lazy } from "react";
import Loadable from "app/components/Loadable";

const ClubList = Loadable(lazy(() => import("./ClubList")));
const ClubCreate = Loadable(lazy(() => import("./ClubCreate")));
const ClubUpdate = Loadable(lazy(() => import("./ClubUpdate")));
const ClubDetail = Loadable(lazy(() => import("./ClubDetail")));

const ClubRoutes = [
  { path: "clubs", element: <ClubList /> },
  { path: "clubs/create", element: <ClubCreate /> },
  { path: "clubs/update/:id", element: <ClubUpdate /> },
  { path: "clubs/detail/:id", element: <ClubDetail /> }
];

export default ClubRoutes;
