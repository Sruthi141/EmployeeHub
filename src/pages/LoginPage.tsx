import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight, Mail, Sun, Moon, LayoutDashboard, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/list", { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const success = login(username, password);
    setLoading(false);
    if (success) {
      toast.success("Welcome back!");
      navigate("/list");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(regEmail)) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.setItem("registeredUser", JSON.stringify({ name: regName, email: regEmail }));
    setLoading(false);
    toast.success("Registration successful! Please login.");
    setTab("login");
    setUsername("");
    setPassword("");
  };

  const handleGoogleLogin = (account: string) => {
    setShowGoogleModal(false);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("googleUser", account);
    toast.success(`Signed in as ${account}`);
    navigate("/list");
    window.location.reload();
  };

  const googleAccounts = [
    { name: "SruthiK", email: "sruthi@gmail.com", avatar: "SK" },
    { name: "ManuD", email: "manu@gmail.com", avatar: "MD" },
    { name: "HiranM", email: "hiran@gmail.com", avatar: "HM" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">Dashboard</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Background */}
      <div className="absolute inset-0 gradient-primary opacity-90" />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, -60, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "10%" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-primary-foreground/10 blur-3xl"
        animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "10%", right: "10%" }}
      />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Hero text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-display font-bold text-primary-foreground mb-2">Employee Dashboard</h1>
            <p className="text-primary-foreground/70 text-sm">Manage your team with ease</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="glass-strong rounded-2xl p-8 shadow-glow">
              {/* Tabs */}
              <div className="flex bg-secondary rounded-xl p-1 mb-6">
                {(["login", "register"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setError(""); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      tab === t
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "login" ? "Sign In" : "Register"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {tab === "login" ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
                          placeholder="Enter username" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
                          placeholder="Enter password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                        transition={{ x: { duration: 0.4 } }} className="text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-lg">
                        {error}
                      </motion.div>
                    )}
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity">
                      {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                      ) : (<>Sign In<ArrowRight className="w-4 h-4" /></>)}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
                          placeholder="John Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
                          placeholder="john@example.com" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
                          placeholder="Create password" />
                      </div>
                    </div>
                    {error && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                        transition={{ x: { duration: 0.4 } }} className="text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-lg">
                        {error}
                      </motion.div>
                    )}
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity">
                      {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                      ) : (<>Create Account<UserPlus className="w-4 h-4" /></>)}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Google button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-3 rounded-xl bg-secondary border border-border text-foreground font-medium text-sm flex items-center justify-center gap-3 hover:bg-muted transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>

              <p className="text-center text-xs text-muted-foreground mt-5">
                Demo: testuser / Test123
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Google Account Picker Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowGoogleModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl shadow-glow p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground">Choose an account</h3>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowGoogleModal(false)}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">to continue to Dashboard</p>
              <div className="space-y-2">
                {googleAccounts.map((acc) => (
                  <motion.button
                    key={acc.email}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGoogleLogin(acc.email)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {acc.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{acc.name}</p>
                      <p className="text-xs text-muted-foreground">{acc.email}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
