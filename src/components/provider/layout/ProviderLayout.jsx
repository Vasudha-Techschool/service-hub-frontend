
import { Outlet } from "react-router-dom";
import ProviderSidebar from "../Sidebar";
import ProviderHeader from "../Header";

export default function ProviderLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProviderSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <ProviderHeader />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
