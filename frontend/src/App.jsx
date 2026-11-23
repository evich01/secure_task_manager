import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignupForm } from "./Components/SignupForm";
import { Users } from "./Components/Users";
import { LoginForm } from "./Components/LoginForm";
import { Dashboard } from "./Components/Dashboard";
import { ViewPosts } from "./Components/Post/ViewPosts";
import { CreatePost } from "./Components/Post/CreatePost";
import { EditPost } from "./Components/Post/EditPost";
import { AdminDashboard } from "./Components/Admin/AdminDashboard";
import { ManageUsers } from "./Components/Admin/ManageUsers";
import { EditUser } from "./Components/Admin/EditUser";
import { Settings } from "./Components/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-posts" element={<ViewPosts />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post" element={<EditPost />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/edit-user" element={<EditUser />} />
      </Routes>
    </Router>
  );
}

export default App;
