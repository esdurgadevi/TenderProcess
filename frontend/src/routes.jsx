import React from "react";
import { Navigate } from "react-router-dom";

// ================= AUTH PAGES =================
import AuthPage from "./pages/auth/authPage.jsx";

// ================= DASHBOARDS =================
import TenderProviderDashboard from "./pages/tender/TenderProviderDashboard.jsx";
import BidderDashboard from "./pages/bidder/BidderDashboard.jsx";

// ================= COMMON =================
import NotFound from "./pages/NotFound.jsx";


// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children, role }) => {

  const userStr = localStorage.getItem("user");

  const user = userStr ? JSON.parse(userStr) : null;

  // NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ROLE CHECK
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ================= ROUTES =================
const routes = [

  // DEFAULT
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // AUTH PAGE
  {
    path: "/login",
    element: <AuthPage />,
  },

  {
    path: "/register",
    element: <AuthPage />,
  },



  // ================= TENDER PROVIDER =================
  {
    path: "/tender-provider",
    element: (
      <ProtectedRoute role="TENDER_PROVIDER">
        <TenderProviderDashboard />
      </ProtectedRoute>
    ),
  },



  // ================= BIDDER =================
  {
    path: "/bidder",
    element: (
      <ProtectedRoute role="BIDDER">
        <BidderDashboard />
      </ProtectedRoute>
    ),
  },



  // ================= NOT FOUND =================
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;