
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import AdminRoutes from "./AdminRoutes";
// import CustomerRoutes from "./CustomerRoutes";
// import ProviderRoutes from "./ProviderRoutes";
// import CommonRoutes from "./CommonRoutes";

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/admin/*" element={<AdminRoutes />} />
//         <Route path="/customer/*" element={<CustomerRoutes />} />
//         <Route path="/provider/*" element={<ProviderRoutes />} />
//         <Route path="/*" element={<CommonRoutes />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;




import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";
import ProviderRoutes from "./ProviderRoutes";
import CommonRoutes from "./CommonRoutes";

import { NotificationProvider } from "../context/NotificationContext";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/customer/*" element={<CustomerRoutes />} />
          <Route path="/provider/*" element={<ProviderRoutes />} />
          <Route path="/*" element={<CommonRoutes />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
