import React from "react";

const ProgressBar = ({ value, max, label }: { value: number; max: number; label }) => {
  let percentage = (value / max) * 100;

  // ✅ Clamp at 100%
  if (percentage > 100) {
    percentage = 100;
  }
  return (
    <div className="w-full max-w-md mx-auto mb-4">
      {/* Progress container */}
      <div className="flex justify-between items-center">
      <div className="w-full bg-gray border-blue-light border-2 rounded-full h-6 relative">
        {/* Filled part */}
        <div
          className={`bg-blue h-5 rounded-full text-white flex items-center justify-end pr-2 transition-all duration-300 ${value == 0 ? 'hidden' : 'visible'}`} 
          style={{ width: `${percentage}%` }}
          >
        </div>
      </div>
          <span className="text-lg font-medium mr-2">{value}/{max}</span>
        </div>

      {/* Bottom label */}
      {label}
    </div>
  );
};

export default ProgressBar;
