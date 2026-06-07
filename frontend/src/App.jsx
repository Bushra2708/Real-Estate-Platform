import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PropertyDetails from "./pages/PropertyDetails";
import CreateProperty from "./pages/CreateProperty";
import EditProperty from "./pages/EditProperty";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/create-property" element={<CreateProperty />} />
        <Route path="/edit-property/:id" element={<EditProperty />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#141d2e",
            color: "#f8fafc",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
          },
          success: {
            iconTheme: { primary: "#d4af37", secondary: "#000" },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;