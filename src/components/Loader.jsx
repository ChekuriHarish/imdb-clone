import React from "react";
export default function Loader({ label = "Loading..." }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6 gap-2">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      {label && (
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300">
          {label}
        </p>
      )}
    </div>
  );
}
