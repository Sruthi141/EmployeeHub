import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="rounded-xl bg-card shadow-card p-5 space-y-4">
    <div className="h-5 w-3/5 rounded-md skeleton-shimmer" />
    <div className="h-4 w-4/5 rounded-md skeleton-shimmer" />
    <div className="h-4 w-2/5 rounded-md skeleton-shimmer" />
    <div className="flex gap-2 pt-2">
      <div className="h-6 w-16 rounded-full skeleton-shimmer" />
      <div className="h-6 w-20 rounded-full skeleton-shimmer" />
    </div>
  </div>
);

const LoadingSkeleton = ({ count = 6 }: { count?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </motion.div>
);

export default LoadingSkeleton;
