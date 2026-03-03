import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, X, ArrowLeft, User, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

const DetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const emp = state as Record<string, string> | null;

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setShowCamera(false);
      toast.success("Photo captured!");
      navigate("/photo", { state: { image: imageSrc, employee: emp } });
    }
  }, [webcamRef, navigate, emp]);

  if (!emp) {
    return (
      <div className="min-h-screen parallax-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No employee data found.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/list")}
            className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-glow"
          >
            Back to List
          </motion.button>
        </div>
      </div>
    );
  }

  const details = [
    { label: "Name", value: emp.employee_name, icon: User },
    { label: "Salary", value: `$${Number(emp.employee_salary)?.toLocaleString()}`, icon: DollarSign },
    { label: "Age", value: emp.employee_age, icon: Calendar },
  ];

  return (
    <div className="min-h-screen parallax-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={() => navigate("/list")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl shadow-card p-6 sm:p-8 border border-border/50"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold font-display">
              {emp.employee_name?.charAt(0) || "#"}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{emp.employee_name}</h1>
              <p className="text-muted-foreground text-sm">Employee ID: {emp.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {details.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-secondary rounded-xl p-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <d.icon className="w-3.5 h-3.5" />
                  {d.label}
                </div>
                <p className="font-semibold text-foreground text-lg">{d.value || "N/A"}</p>
              </motion.div>
            ))}
          </div>

          {Object.entries(emp)
            .filter(([k]) => !["id", "employee_name", "employee_salary", "employee_age"].includes(k))
            .length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-secondary rounded-xl p-4 mb-8"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Additional Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(emp)
                  .filter(([k]) => !["id", "employee_name", "employee_salary", "employee_age"].includes(k))
                  .map(([key, val]) => (
                    <div key={key}>
                      <span className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                      <p className="text-sm font-medium text-foreground">{val}</p>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCamera(true)}
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-glow flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Camera className="w-4 h-4" />
            Capture Photo
          </motion.button>
        </motion.div>

        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl shadow-glow p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground">Camera</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCamera(false)}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="rounded-xl overflow-hidden mb-4 bg-secondary">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full aspect-video object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={capture}
                  className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-glow"
                >
                  Capture
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCamera(false)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DetailsPage;
