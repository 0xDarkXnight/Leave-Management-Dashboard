import { Outlet } from "react-router-dom";
import Navbar    from "../components/Navbar";
import TopHeader from "../components/TopHeader";

function AppShellLayout({
  sidebarOpen,
  closeSidebar,
  setSidebarOpen,
  userRole,
  onLogout,
}) {
  return (
    <div className="app-shell">
      <Navbar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        userRole={userRole}
        onLogout={onLogout}
      />

      <div className="main-wrapper">
        <TopHeader
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          userRole={userRole}
        />

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShellLayout;