import React, { useEffect } from "react";

const Title = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default Title;