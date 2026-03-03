import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, RotateCcw, List } from "lucide-react";

const PhotoResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState<string | undefined>(state?.image);
  const employee = state?.employee as Record<string, string> | undefined;

  // Persist/restore from localStorage
  useEffect(() => {
    if (image) {
      localStorage.setItem("capturedPhoto", image);
    } else {
      const saved = localStorage.getItem("capturedPhoto");
      if (saved) setImage(saved);
    }
  }, [image]);

  if (!image) {
    return (
      <div className="min-h-screen parallax-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No photo found.</p>
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = `photo-${employee?.employee_name || "capture"}.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen parallax-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-card rounded-2xl shadow-glow overflow-hidden border border-border/50"
        >
          {employee && (
            <div className="p-6 pb-0">
              <h1 className="text-xl font-display font-bold text-foreground">{employee.employee_name}</h1>
              <p className="text-sm text-muted-foreground">Captured Photo</p>
            </div>
          )}

          <div className="p-6">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="rounded-xl overflow-hidden shadow-card"
            >
              <img src={image} alt="Captured" className="w-full aspect-video object-cover" />
            </motion.div>
          </div>

          <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(-1)}
              className="flex-1 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Retake
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleDownload}
              className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-glow flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/list")}
              className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium flex items-center justify-center gap-2">
              <List className="w-4 h-4" /> Back to List
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PhotoResultPage;
