import React, { useState } from "react";
import { Search } from "lucide-react";

const CourseFilters = ({ onSearch, onSortChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("newest");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSort(value);
    onSortChange(value);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative w-full sm:w-1/2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search courses or instructors..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
        />
      </div>

      {/* Sort */}
      <div>
        <select
          value={sort}
          onChange={handleSortChange}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
        </select>
      </div>
    </div>
  );
};

export default CourseFilters;
