import "./styles/Tailwind.css";
import LogIn from "./Request/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Forgot from "./Request/Forgot";
import SignUp from "./Request/Signup";
import DashBoard from "./Dashboard/Dashboard";
import Unit from "./Dashboard/Setup/Unit";
import Set from "./Dashboard/Setup/Set";
import Profile from "./Dashboard/Profile";
import Computers from "./Dashboard/Computers";
import QrC from "./Dashboard/Qrcodes";
import Extract from "./Dashboard/Extract";
import ProtectedRoutes from "./context/ProtectedRoutes";
import AuthContext from "./context/AuthContext";
import Reset from "./Request/Reset";
import ChangePassword from "./context/ChangePassword";
import User from "./Dashboard/Setup/User";
import Add from "./Dashboard/Setup/Add";
import TransferedUnits from "./Dashboard/transferedUnits";
import NotFound from "./Dashboard/Notfound";
import PrintInformation from "./Dashboard/PopupForComputers/Print";
import AllLogs from "./Dashboard/AllLogs";
import AllUnits from "./Dashboard/allUnits";
import Users from "./Dashboard/Setup/Users";
import Branches from "./Dashboard/Setup/Branches";
import { AdminProvider } from "./context/AdminContext";
import NotAuthorized from "./components/NotAuthorized";
import BranchCode from "./pages/branch-code/BranchCode";
import Department from "./pages/department/Department";
import Supplier from "./pages/supplier/Supplier";
import Position from "./pages/position/Position";
import Category from "./pages/categories/Category";
import TransferedBranchUnits from "./Dashboard/transferedBranchUnits";

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthContext />}>
            <Route path="/login" element={<LogIn />}></Route>
            <Route path="/" element={<LogIn />}></Route>
            <Route path="/forgot" element={<Forgot />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Route>

          <Route element={<ChangePassword />}>
            <Route path="/change-new-password" element={<Reset />}></Route>
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashBoard />}></Route>
            <Route path="/unit" element={<Unit />}></Route>
            <Route path="/set" element={<Set />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/branches" element={<BranchCode />}></Route>
            <Route path="/departments" element={<Department />}></Route>
            <Route path="/categories" element={<Category />}></Route>
            <Route path="/suppliers" element={<Supplier />}></Route>
            <Route path="/positions" element={<Position />}></Route>
            <Route path="/computers" element={<Computers />}></Route>
            <Route path="/qr" element={<QrC />}></Route>
            <Route
              path="/transfered-units"
              element={<TransferedUnits />}
            ></Route>
            <Route
              path="/transfered-branch-units"
              element={<TransferedBranchUnits />}
            ></Route>
            <Route path="/all-units" element={<AllUnits />}></Route>
            <Route path="/computers/:id" element={<Extract />} />
            <Route path="/user" element={<User />} />
            <Route path="/setup/branch-units" element={<Branches />} />
            <Route path="/all-logs" element={<AllLogs />} />
            <Route path="/not-authorized-user" element={<NotAuthorized />} />
            <Route path="/add" element={<Add />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/print/:id" element={<PrintInformation />} />
            <Route path="/admin/users-list" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
