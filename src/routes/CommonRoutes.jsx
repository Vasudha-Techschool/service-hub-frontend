import { Link } from "react-router-dom";

const CommonRoutes = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-teal-700">
          Service Hub
        </h1>

        <p className="mt-2 text-gray-600">
          Select your portal to continue.
        </p>

        <div className="mt-6 space-y-4">
          <Link
            to="/customer/login"
            className="block rounded-lg bg-teal-700 p-3 text-center text-white"
          >
            Customer Login
          </Link>

          

          <Link
            to="/provider/login"
            className="block rounded-lg bg-teal-700 p-3 text-center text-white"
          >
            Provider Login
          </Link>


          <Link
            to="/admin/login"
            className="block rounded-lg border border-purple-300 p-3 text-center text-purple-700"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommonRoutes;