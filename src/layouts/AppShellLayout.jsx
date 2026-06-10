import { Outlet } from "react-router-dom";
import Navbar     from "../components/Navbar";
import TopHeader  from "../components/TopHeader";

function AppShellLayout({ sidebarOpen, closeSidebar, setSidebarOpen }) {
  return (
    <div className="app-shell">
      <Navbar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="main-wrapper">
        <TopHeader
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShellLayout;