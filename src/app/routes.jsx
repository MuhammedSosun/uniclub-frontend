import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";

import sessionRoutes from "./views/sessions/session-routes";
import ClubRoutes from "./views/clubs";
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));

const MemberList = Loadable(lazy(() => import("app/views/members/MemberList")));
const MemberDetail = Loadable(lazy(() => import("app/views/members/MemberDetail")));

const EventList = Loadable(lazy(() => import("app/views/events/EventList")));
const EventCreate = Loadable(lazy(() => import("app/views/events/EventCreate")));
const About = Loadable(lazy(() => import("app/views/about")));
const Profile = Loadable(lazy(() => import("app/views/account/Profile")));
const MyAccount = Loadable(lazy(() => import("app/views/account/MyAccount")));

const routes = [
  { path: "/", element: <Navigate to="dashboard" /> },

  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      { path: "dashboard", element: <Analytics /> },

      { path: "members", element: <MemberList /> },
      { path: "members/detail/:id", element: <MemberDetail /> },

      { path: "events", element: <EventList /> },
      { path: "events/create", element: <EventCreate /> },
      { path: "about", element: <About /> },
      { path: "my-account", element: <MyAccount /> },
      { path: "profile", element: <MyAccount /> },
      { path: "profile/edit", element: <Profile /> },

      ...ClubRoutes
    ]
  },

  ...sessionRoutes
];

export default routes;
