"use client";
import SideBarLayout from "../SidebarLayout";
import withAuth from "../context/ProtectedRoute";
const ProtectedLayout = ({ children }) => {
  return <SideBarLayout>{children}</SideBarLayout>;
};

export default withAuth(ProtectedLayout);
