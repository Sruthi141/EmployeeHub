import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  employee_name: string;
  employee_salary: string;
  employee_age: string;
  [key: string]: string;
}

interface EditEmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
  onSave: (updated: Employee) => void;
}

const EditEmployeeModal = ({ employee, onClose, onSave }: EditEmployeeModalProps) => {
  const [form, setForm] = useState<Employee>(employee || {} as Employee);

  if (!employee) return null;

  const handleSave = () => {
    if (!form.employee_name?.trim()) {
      toast.error("Name is required");
      return;
    }
    onSave(form);
    toast.success("Employee updated successfully");
    onClose();
  };

  const fields = [
    { key: "employee_name", label: "Name" },
    { key: "employee_salary", label: "Salary" },
    { key: "employee_age", label: "Age" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl shadow-glow p-6 w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">Edit Employee</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{f.label}</label>
                <input
                  type="text"
                  value={form[f.key] || ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-glow flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditEmployeeModal;
