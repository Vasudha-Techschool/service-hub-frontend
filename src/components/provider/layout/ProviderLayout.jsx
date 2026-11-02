import { useState } from "react";
import { Outlet } from "react-router-dom";
import ProviderSidebar from "../Sidebar";
import ProviderHeader from "../Header";

export default function ProviderLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      <ProviderSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="min-h-screen lg:pl-64">

        <ProviderHeader
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}