import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Strategy from './pages/Strategy';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './components/NotFound';

const Router = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/strategy" element={<Strategy />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Protected routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<div>Dashboard Content</div>} />
        <Route path="/settings" element={<div>Settings Content</div>} />
        <Route path="/designs" element={<div>Designs Content</div>} />
        <Route path="/collections" element={<div>Collections Content</div>} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
