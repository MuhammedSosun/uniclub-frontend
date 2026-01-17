import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";
import materialRoutes from "app/views/material-kit/MaterialRoutes";

// CLUB ROUTES
import ClubRoutes from "./views/clubs"; // 🔥 DOĞRU YER

// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));
const UserList = Loadable(lazy(() => import("app/views/users/UserList")));
const EventList = Loadable(lazy(() => import("app/views/events/EventList")));
const EventCreate = Loadable(lazy(() => import("app/views/events/EventCreate")));
const About = Loadable(lazy(() => import("app/views/about/index")));
const Profile = Loadable(lazy(() => import("app/views/account/Profile")));
const MyAccount = Loadable(lazy(() => import("app/views/account/MyAccount")));

const routes = [
  { path: "/", element: <Navigate to="dashboard/default" /> },

  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),

    children: [
      ...materialRoutes,

      { path: "/dashboard/default", element: <Analytics /> },
      { path: "/charts/echarts", element: <AppEchart /> },
      { path: "/users", element: <UserList /> },
      { path: "/events", element: <EventList /> },
      { path: "/events/create", element: <EventCreate /> },
      { path: "/about", element: <About /> },
      { path: "/my-account", element: <MyAccount /> },
      { path: "/profile", element: <Profile /> },

      ...ClubRoutes
    ]
  },

  ...sessionRoutes
];

export default routes;
