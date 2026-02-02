import { lazy } from "react";
import Loadable from "app/components/Loadable";

const ClubList = Loadable(lazy(() => import("./ClubList")));
const ClubCreate = Loadable(lazy(() => import("./ClubCreate")));
const ClubUpdate = Loadable(lazy(() => import("./ClubUpdate")));
const ClubDetail = Loadable(lazy(() => import("./ClubDetail")));
const ClubMembers = Loadable(lazy(() => import("./ClubMembers")));
const ClubMembersManage = Loadable(lazy(() => import("./ClubMembersManage")));

const ClubRoutes = [
  { path: "clubs", element: <ClubList /> },
  { path: "clubs/create", element: <ClubCreate /> },
  { path: "clubs/update/:id", element: <ClubUpdate /> },
  { path: "clubs/detail/:id", element: <ClubDetail /> },

  // 👇 SADECE LİSTELEME
  {
    path: "clubs/:clubId/members",
    element: <ClubMembers />
  },

  // 👇 YÖNETİM
  {
    path: "clubs/:clubId/members/manage",
    element: <ClubMembersManage />
  }
];

export default ClubRoutes;
