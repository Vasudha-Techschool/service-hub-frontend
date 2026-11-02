// import { useState } from "react";
// import CustomerSidebar from "../../components/customer/Sidebar";
// import CustomerHeader from "../../components/customer/Header";

// import CustomerSearch from "../../components/customer/CustomerSearch";




// const CustomerSearchPage = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <CustomerSidebar
//         open={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         collapsed={collapsed}
//         onToggleCollapse={() => setCollapsed((prev) => !prev)}
//       />

//       {/* Main content: leave space for the fixed sidebar */}
//       <div
//         className={`min-h-screen min-w-0 transition-all duration-300 ${
//           collapsed ? "lg:ml-20" : "lg:ml-64"
//         }`}
//       >
//         <CustomerHeader />

//         <main className="min-w-0 p-4 sm:p-6 lg:p-8">
//           <CustomerSearch />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CustomerSearchPage;



import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Paintbrush,
  Wrench,
  Zap,
  Sparkles,
  Snowflake,
  Hammer,
  Home,
  Search,
  ArrowRight,
  LoaderCircle,
  Grid2X2,
} from "lucide-react";

import CustomerSidebar from "../../components/customer/Sidebar";
import CustomerHeader from "../../components/customer/Header";
import CustomerSearch from "../../components/customer/CustomerSearch";
import api from "../../api/axios";

const categoryIcons = {
  painting: Paintbrush,
  plumbing: Wrench,
  electrical: Zap,
  cleaning: Sparkles,
  "ac repair": Snowflake,
  carpentry: Hammer,
};

const getCategoryIcon = (category) => {
  const key = category.toLowerCase();
  return categoryIcons[key] || Home;
};

const CustomerSearchPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get("/api/services/service-categories/");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch service categories:", error);
        setCategoryError("Unable to load service categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(
      `${location.pathname}?search=${encodeURIComponent(category)}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      <div
        className={`min-h-screen min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <CustomerHeader />

        <main className="min-w-0 p-4 sm:p-6 lg:p-8 space-y-8">

          {/* Browse Categories */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium mb-2">
                  <Grid2X2 size={16} />
                  Explore Services
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                  Browse by Category
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Find the right professional for your home service needs.
                </p>
              </div>

              {!loadingCategories && categories.length > 0 && (
                <span className="text-sm text-gray-500">
                  {categories.length} service categories
                </span>
              )}
            </div>

            {loadingCategories ? (
              <div className="flex items-center justify-center py-12 bg-white rounded-2xl border border-gray-100">
                <LoaderCircle className="animate-spin text-green-600" size={24} />
                <span className="ml-3 text-sm text-gray-500">
                  Loading categories...
                </span>
              </div>
            ) : categoryError ? (
              <div className="bg-white border border-red-100 rounded-xl p-5 text-sm text-red-600">
                {categoryError}
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
                <Search className="mx-auto text-gray-400 mb-3" size={28} />
                <p className="font-medium text-gray-700">
                  No service categories available yet.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Categories will appear when providers add their services.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {categories.map((category, index) => {
                  const Icon = getCategoryIcon(category);

                  return (
                    <button
                      key={`${category}-${index}`}
                      onClick={() => handleCategoryClick(category)}
                      className="group text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-green-500 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                          <Icon size={23} strokeWidth={1.8} />
                        </div>

                        <ArrowRight
                          size={18}
                          className="text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all"
                        />
                      </div>

                      <h3 className="font-semibold text-gray-800 capitalize group-hover:text-green-700 transition-colors">
                        {category}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Explore professionals
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Provider Search */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Find Your Service Provider
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Search by service name or location.
              </p>
            </div>

            <CustomerSearch />
          </section>

        </main>
      </div>
    </div>
  );
};

export default CustomerSearchPage;
