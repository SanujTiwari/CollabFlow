import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import WorkspaceBoards from "./pages/WorkspaceBoards";
import WorkspaceMembers from "./pages/WorkspaceMembers";
import WorkspaceActivity from "./pages/WorkspaceActivity";
import ProtectedRoute from "./components/ProtectedRoute";
import WorkspaceLayout from "./components/layout/WorkspaceLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace/:workspaceId"
            element={
              <ProtectedRoute>
                <WorkspaceLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<WorkspaceBoards />} />
            <Route path="board/:boardId" element={<BoardView />} />
            <Route path="members" element={<WorkspaceMembers />} />
            <Route path="activity" element={<WorkspaceActivity />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;