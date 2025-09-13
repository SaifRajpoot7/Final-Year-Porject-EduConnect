// import React, { useState } from "react";
// import CourseCard from "../../components/CourseCard";
// import PageTitle from "../../components/other/PageTitle";
// import CourseFilters from "../../components/CourseFilters";

// const AllCourses = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("newest");
  // const courses = [
  //   {
  //     id: 1,
  //     thumbnail: "https://placehold.co/600x400?text=React+Course",
  //     title: "Mastering React for Beginners to Advanced",
  //     instructor: "Saif ur Rehman",
  //     role: "student",
  //     link: "/courses/1",
  //   },
  //   {
  //     id: 2,
  //     thumbnail: "https://placehold.co/600x400?text=Node+Course",
  //     title: "Node.js Backend Development Crash Course",
  //     instructor: "John Doe",
  //     role: "teacher",
  //     link: "/courses/2",
  //   },
  //   {
  //     id: 3,
  //     thumbnail: "https://placehold.co/600x400?text=JavaScript",
  //     title: "JavaScript Essentials and ES6+ Features",
  //     instructor: "Alice Smith",
  //     role: "student",
  //     link: "/courses/3",
  //   },
  //   {
  //     id: 4,
  //     thumbnail: "https://placehold.co/600x400?text=MongoDB",
  //     title: "MongoDB Complete Guide",
  //     instructor: "Michael Brown",
  //     role: "teacher",
  //     link: "/courses/4",
  //   },
  //   {
  //     id: 5,
  //     thumbnail: "https://placehold.co/600x400?text=Express",
  //     title: "Express.js Hands-on Training",
  //     instructor: "David Wilson",
  //     role: "student",
  //     link: "/courses/5",
  //   },
  //   {
  //     id: 6,
  //     thumbnail: "https://placehold.co/600x400?text=Next.js",
  //     title: "Next.js Zero to Hero",
  //     instructor: "Sarah Lee",
  //     role: "teacher",
  //     link: "/courses/6",
  //   },
  //   {
  //     id: 7,
  //     thumbnail: "https://placehold.co/600x400?text=TypeScript",
  //     title: "TypeScript for React Developers",
  //     instructor: "Emma Johnson",
  //     role: "student",
  //     link: "/courses/7",
  //   },
  //   {
  //     id: 8,
  //     thumbnail: "https://placehold.co/600x400?text=Python",
  //     title: "Python Programming Bootcamp",
  //     instructor: "Robert King",
  //     role: "teacher",
  //     link: "/courses/8",
  //   },
  //   {
  //     id: 9,
  //     thumbnail: "https://placehold.co/600x400?text=Django",
  //     title: "Django Web Development with Python",
  //     instructor: "Sophia White",
  //     role: "student",
  //     link: "/courses/9",
  //   },
  //   {
  //     id: 10,
  //     thumbnail: "https://placehold.co/600x400?text=Flask",
  //     title: "Flask Backend Fundamentals",
  //     instructor: "James Miller",
  //     role: "teacher",
  //     link: "/courses/10",
  //   },
  //   {
  //     id: 11,
  //     thumbnail: "https://placehold.co/600x400?text=Angular",
  //     title: "Angular Complete Guide",
  //     instructor: "Linda Martinez",
  //     role: "student",
  //     link: "/courses/11",
  //   },
  //   {
  //     id: 12,
  //     thumbnail: "https://placehold.co/600x400?text=Vue.js",
  //     title: "Vue.js Crash Course",
  //     instructor: "Daniel Garcia",
  //     role: "teacher",
  //     link: "/courses/12",
  //   },
  //   {
  //     id: 13,
  //     thumbnail: "https://placehold.co/600x400?text=HTML+CSS",
  //     title: "Modern HTML5 & CSS3",
  //     instructor: "Emily Davis",
  //     role: "student",
  //     link: "/courses/13",
  //   },
  //   {
  //     id: 14,
  //     thumbnail: "https://placehold.co/600x400?text=Tailwind",
  //     title: "Tailwind CSS Design Masterclass",
  //     instructor: "Matthew Clark",
  //     role: "teacher",
  //     link: "/courses/14",
  //   },
  //   {
  //     id: 15,
  //     thumbnail: "https://placehold.co/600x400?text=Bootstrap",
  //     title: "Bootstrap Responsive Design",
  //     instructor: "Isabella Hall",
  //     role: "student",
  //     link: "/courses/15",
  //   },
  //   {
  //     id: 16,
  //     thumbnail: "https://placehold.co/600x400?text=SQL",
  //     title: "SQL & Database Management",
  //     instructor: "Anthony Walker",
  //     role: "teacher",
  //     link: "/courses/16",
  //   },
  //   {
  //     id: 17,
  //     thumbnail: "https://placehold.co/600x400?text=PostgreSQL",
  //     title: "PostgreSQL Advanced Features",
  //     instructor: "Grace Allen",
  //     role: "student",
  //     link: "/courses/17",
  //   },
  //   {
  //     id: 18,
  //     thumbnail: "https://placehold.co/600x400?text=PHP",
  //     title: "PHP and MySQL Web Apps",
  //     instructor: "Christopher Young",
  //     role: "teacher",
  //     link: "/courses/18",
  //   },
  //   {
  //     id: 19,
  //     thumbnail: "https://placehold.co/600x400?text=Laravel",
  //     title: "Laravel for Modern Web Development",
  //     instructor: "Olivia Hernandez",
  //     role: "student",
  //     link: "/courses/19",
  //   },
  //   {
  //     id: 20,
  //     thumbnail: "https://placehold.co/600x400?text=Ruby",
  //     title: "Ruby Programming Basics",
  //     instructor: "Ethan Scott",
  //     role: "teacher",
  //     link: "/courses/20",
  //   },
  //   {
  //     id: 21,
  //     thumbnail: "https://placehold.co/600x400?text=Rails",
  //     title: "Ruby on Rails Crash Course",
  //     instructor: "Amelia Adams",
  //     role: "student",
  //     link: "/courses/21",
  //   },
  //   {
  //     id: 22,
  //     thumbnail: "https://placehold.co/600x400?text=Java",
  //     title: "Java Programming Masterclass",
  //     instructor: "Benjamin Baker",
  //     role: "teacher",
  //     link: "/courses/22",
  //   },
  //   {
  //     id: 23,
  //     thumbnail: "https://placehold.co/600x400?text=Spring+Boot",
  //     title: "Spring Boot Microservices",
  //     instructor: "Charlotte Perez",
  //     role: "student",
  //     link: "/courses/23",
  //   },
  //   {
  //     id: 24,
  //     thumbnail: "https://placehold.co/600x400?text=Kotlin",
  //     title: "Kotlin for Android Developers",
  //     instructor: "Henry Rivera",
  //     role: "teacher",
  //     link: "/courses/24",
  //   },
  //   {
  //     id: 25,
  //     thumbnail: "https://placehold.co/600x400?text=Swift",
  //     title: "iOS App Development with Swift",
  //     instructor: "Victoria Campbell",
  //     role: "student",
  //     link: "/courses/25",
  //   },
  //   {
  //     id: 26,
  //     thumbnail: "https://placehold.co/600x400?text=Android",
  //     title: "Android Development Fundamentals",
  //     instructor: "Lucas Mitchell",
  //     role: "teacher",
  //     link: "/courses/26",
  //   },
  //   {
  //     id: 27,
  //     thumbnail: "https://placehold.co/600x400?text=C+Sharp",
  //     title: "C# Programming for Beginners",
  //     instructor: "Harper Roberts",
  //     role: "student",
  //     link: "/courses/27",
  //   },
  //   {
  //     id: 28,
  //     thumbnail: "https://placehold.co/600x400?text=.NET",
  //     title: ".NET Core with C#",
  //     instructor: "Jack Turner",
  //     role: "teacher",
  //     link: "/courses/28",
  //   },
  //   {
  //     id: 29,
  //     thumbnail: "https://placehold.co/600x400?text=DevOps",
  //     title: "DevOps with Docker & Kubernetes",
  //     instructor: "Lily Phillips",
  //     role: "student",
  //     link: "/courses/29",
  //   },
  //   {
  //     id: 30,
  //     thumbnail: "https://placehold.co/600x400?text=Cyber+Security",
  //     title: "Cyber Security Fundamentals",
  //     instructor: "William Evans",
  //     role: "teacher",
  //     link: "/courses/30",
  //   },
  // ];

//   const filteredCourses = courses
//     .filter(
//       (course) =>
//         course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortOption === "az") return a.title.localeCompare(b.title);
//       if (sortOption === "za") return b.title.localeCompare(a.title);
//       return b.id - a.id; // newest first by id
//     });

//   return (
//     <div className="p-2 min-h-screen">
//       <PageTitle title="All Courses" subtitle="Browse all available courses across EduConnect" />
//       {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cls-3 lg:grid-cols-4 gap-6">
//         {courses.map((course) => (
//           <CourseCard key={course.id} {...course} />
//         ))}
//       </div> */}
//       <CourseFilters
//         onSearch={(val) => setSearchQuery(val)}
//         onSortChange={(val) => setSortOption(val)}
//       />

//       {/* Course Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredCourses.map((course) => (
//           <CourseCard key={course.id} {...course} />
//         ))}
//       </div>

//     </div>
//   );
// };

// export default AllCourses;

import React, { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard";
import PageTitle from "../../components/other/PageTitle";
import CourseFilters from "../../components/CourseFilters";

const AllCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // courses per page
  const [paginatedCourses, setPaginatedCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ---- Simulated backend fetch (from JSON) ----
  const fetchCourses = async (page, limit, query, sort) => {
    setLoading(true);

    const response = await fetch("/data/courses.json"); // json file in public/data
    const data = await response.json();

    // Filtering
    let filtered = data.filter(
      (course) =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor.toLowerCase().includes(query.toLowerCase())
    );

    // Sorting
    filtered.sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);
      return b.id - a.id; // newest
    });

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageData = filtered.slice(startIndex, endIndex);

    setPaginatedCourses(pageData);
    setTotalPages(Math.ceil(filtered.length / limit));
    setLoading(false);
  };

  // Refetch on changes
  useEffect(() => {
    fetchCourses(page, limit, searchQuery, sortOption);
  }, [searchQuery, sortOption, page]);

  return (
    <div className="p-2 min-h-screen">
      <PageTitle
        title="All Courses"
        subtitle="Browse all courses you joined or created across EduConnect"
      />

      {/* Filters */}
      <CourseFilters
        onSearch={(val) => {
          setPage(1); // reset to first page when search changes
          setSearchQuery(val);
        }}
        onSortChange={(val) => {
          setPage(1); // reset page on sort change
          setSortOption(val);
        }}
      />

      {/* Course Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded-lg border ${
            page === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded-lg border ${
            page === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllCoursesPage;
