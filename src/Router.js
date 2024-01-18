import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Registration from "./Components/Customer/Registration";
import Homepage from "./Components/Customer/Homepage";
import StaffHomepage from "./Components/Staff/Homepage";
import AdminHomepage from "./Components/Admin/Homepage";

export default function Router() {
  return (
    <div>
      <Routers>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/staff/homepage" element={<StaffHomepage />} />
          <Route path="/admin/homepage" element={<AdminHomepage />} />
        </Routes>
      </Routers>
    </div>
  );
}
