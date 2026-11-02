import { useState } from "react";
import CustomerSidebar from "../../components/customer/Sidebar";
import CustomerHeader from "../../components/customer/Header";

import ProviderDetails from "../../components/customer/ProviderDetails";




const ProviderDetailsPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      {/* Main content: leave space for the fixed sidebar */}
      <div
        className={`min-h-screen min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <CustomerHeader />

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <ProviderDetails />
        </main>
      </div>
    </div>
  );
};

export default ProviderDetailsPage;


