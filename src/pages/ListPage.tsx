import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  ArrowUpDown,
  BarChart3,
  X,
  DollarSign,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Users,
  Menu,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EditEmployeeModal from "@/components/EditEmployeeModal";
import { dummyEmployees } from "@/data/dummyEmployees";

interface Employee {
  id: string;
  employee_name: string;
  employee_salary: string;
  employee_age: string;
  [key: string]: any;
}

const PAGE_SIZES = [6, 12, 24];
const API_URL = "https://backend.jotish.in/backend_dev/gettabledata.php";

const ListPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // NOTE: error is only used for the "no data at all" state now
  const [error, setError] = useState("");

  const [usingFallback, setUsingFallback] = useState(false);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Employee>("employee_name");

  const [showChart, setShowChart] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ prevents double fetch in React 18 dev StrictMode
  const didFetchRef = useRef(false);
  // ✅ prevents toast spam
  const didToastRef = useRef(false);

  const mergeWithEdits = (items: Employee[]) => {
    const saved = localStorage.getItem("editedEmployees");
    if (!saved) return items;

    try {
      const edits = JSON.parse(saved) as Record<string, Employee>;
      return items.map((emp) => (edits?.[emp.id] ? { ...emp, ...edits[emp.id] } : emp));
    } catch {
      return items;
    }
  };

  const normalizeApiItems = (raw: any): Employee[] => {
    if (Array.isArray(raw)) return raw as Employee[];
    if (Array.isArray(raw?.data)) return raw.data as Employee[];
    if (Array.isArray(raw?.result)) return raw.result as Employee[];
    return [];
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setUsingFallback(false);

    try {
      const res = await axios.post(
        API_URL,
        { username: "test", password: "123456" },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 12000,
        }
      );

      const items = normalizeApiItems(res?.data);

      if (items.length > 0) {
        setData(mergeWithEdits(items));
        setUsingFallback(false);
      } else {
        // ✅ Use fallback and still SHOW data (do not set error)
        setData(mergeWithEdits(dummyEmployees));
        setUsingFallback(true);

        if (!didToastRef.current) {
          didToastRef.current = true;
          toast.error("API returned empty. Showing demo employees.");
        }
      }
    } catch (e: any) {
      // ✅ Use fallback and still SHOW data (do not set error)
      setData(mergeWithEdits(dummyEmployees));
      setUsingFallback(true);

      const msg = navigator.onLine
        ? "API failed. Showing demo employees."
        : "You appear offline. Showing demo employees.";

      if (!didToastRef.current) {
        didToastRef.current = true;
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = data;

    if (q) {
      result = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val ?? "").toLowerCase().includes(q)
        )
      );
    }

    const sorted = [...result].sort((a, b) => {
      const aVal = a?.[sortKey] ?? "";
      const bVal = b?.[sortKey] ?? "";

      if (sortKey === "employee_salary" || sortKey === "employee_age") {
        return Number(aVal) - Number(bVal);
      }
      return String(aVal).localeCompare(String(bVal));
    });

    return sorted;
  }, [data, search, sortKey]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginatedData = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, sortKey, pageSize]);

  const chartData = useMemo(() => {
    return data.slice(0, 10).map((emp) => ({
      name: emp.employee_name?.split(" ")?.[0] || `#${emp.id}`,
      salary: Number(emp.employee_salary) || 0,
    }));
  }, [data]);

  const handleSaveEdit = (updated: Employee) => {
    setData((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));

    // persist edits
    const saved = localStorage.getItem("editedEmployees");
    const edits = saved ? JSON.parse(saved) : {};
    edits[updated.id] = updated;
    localStorage.setItem("editedEmployees", JSON.stringify(edits));

    toast.success("Employee updated");
  };

  const sidebarLinks = [
    { icon: Users, label: "Employees", active: true },
    { icon: BarChart3, label: "Analytics", active: false },
  ];

  return (
    <div className="min-h-screen parallax-bg flex">
      {/* Sidebar - desktop */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-60 flex-col border-r border-border bg-card/50 backdrop-blur-sm p-4 pt-6 gap-2"
      >
        {sidebarLinks.map((link) => (
          <button
            key={link.label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              link.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </button>
        ))}
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-60 h-full bg-card border-r border-border p-4 pt-6"
            >
              {sidebarLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors ${
                    link.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-3"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Employees
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your team directory ({filtered.length} total)
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-card text-sm transition-all"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={String(sortKey)}
                onChange={(e) => setSortKey(e.target.value as keyof Employee)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
              >
                <option value="employee_name">Name</option>
                <option value="employee_salary">Salary</option>
                <option value="employee_age">Age</option>
              </select>
            </div>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} per page
                </option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowChart(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-glow whitespace-nowrap"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Salary Chart</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Fallback Banner */}
        {usingFallback && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-border bg-card/70 px-4 py-3 text-sm text-muted-foreground"
          >
            Live API unavailable. Showing demo employees (fallback data).
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSkeleton count={pageSize} />
        ) : paginatedData.length === 0 ? (
          <ErrorState
            message={error || "No employees found."}
            onRetry={fetchData}
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {paginatedData.map((emp, i) => (
                <motion.div
                  key={emp.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover cursor-pointer transition-shadow border border-border/50 group relative"
                >
                  <div
                    onClick={() => navigate(`/details/${emp.id}`, { state: emp })}
                    className="flex-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {emp.employee_name?.charAt(0) || "#"}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ID: {emp.id}
                      </span>
                    </div>

                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {emp.employee_name || "Unknown"}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        <DollarSign className="w-3 h-3" />
                        {Number(emp.employee_salary)?.toLocaleString() || "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
                        Age: {emp.employee_age || "N/A"}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingEmployee(emp);
                    }}
                    className="absolute top-3 right-10 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <motion.button
                    key={p}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      p === page
                        ? "gradient-primary text-primary-foreground shadow-glow"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Chart Modal */}
      <AnimatePresence>
        {showChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowChart(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl shadow-glow p-6 w-full max-w-2xl max-h-[85vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Salary Distribution
                  </h2>
                  <p className="text-sm text-muted-foreground">Top 10 employees</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowChart(false)}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px hsl(0 0% 0% / 0.1)",
                        fontSize: "13px",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Salary"]}
                    />
                    <Bar
                      dataKey="salary"
                      fill="url(#barGradient)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                        <stop offset="100%" stopColor="hsl(262 83% 58%)" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default ListPage;