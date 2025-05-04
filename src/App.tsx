
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/attendance" element={<EmployeeDashboard />} />
          <Route path="/employee/leave" element={<EmployeeDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<AdminDashboard />} />
          <Route path="/admin/attendance" element={<AdminDashboard />} />
          <Route path="/admin/leave" element={<AdminDashboard />} />
          <Route path="/admin/payroll" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
