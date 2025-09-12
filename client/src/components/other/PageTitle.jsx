import React, { useEffect } from "react";

const PageTitle = ({ title, subtitle }) => {
  useEffect(() => {
    document.title = title ? `${title} | EduConnect` : "EduConnect";
  }, [title]);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default PageTitle;