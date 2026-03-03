import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message = "Something went wrong", onRetry }: ErrorStateProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 gap-4"
  >
    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
      <AlertCircle className="w-8 h-8 text-destructive" />
    </div>
    <p className="text-muted-foreground text-center max-w-sm">{message}</p>
    {onRetry && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-glow"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </motion.button>
    )}
  </motion.div>
);

export default ErrorState;
