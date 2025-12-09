import React, { useEffect, useState } from "react";
import OverviewCard from "../../components/OverviewCard";
import { CalendarDays, FileText, HelpCircle, TrendingUp, Users } from "lucide-react";
import StudentPerformanceOverTime from "../../components/StudentPerformanceOverTime";
import StudentActivityBreakdown from "../../components/StudentActivityBreakdown";
import TeacherPerformanceDistribution from "../../components/TeacherPerformanceDistribution";
import TeacherWorkloadChart from "../../components/TeacherWorkloadChart";
import PageTitle from "../../components/other/PageTitle";
import Title from "../../components/other/Title";
import { useAppContext } from "../../contexts/AppContext";
import { useParams } from "react-router";
// import { useParams } from "react-router"; // enable later

const CourseDashboardPage = () => {
  const { setMenuType, setCourseId, userData } = useAppContext();
  const { id } = useParams();
  setCourseId(id)

  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetch("/data/courses.json")
      .then((res) => res.json())
      .then((data) => {
        const foundCourse = data.find((c) => String(c.id) === String(id));
        setCourse(foundCourse);
      });
  }, [id]);

  useEffect(() => {
    setMenuType("course");
    return () => setMenuType("general");
  }, [setMenuType]);

  if (!course) {
    return <div className="flex justify-center items-center h-screen">Loading course...</div>;
  }

  const isTeacher = course.teacher_id === userData._id;

  return (
    <div className="p-2 min-h-screen">
      <PageTitle
        title="Dashboard Overview"
        subtitle="Track your progress, lectures, assignments, and performance insight"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        <OverviewCard icon={CalendarDays} title="Upcoming Lectures (Today)" value={2} />
        {isTeacher ? (
          <OverviewCard icon={Users} title="Total Students" value={8} />
        ) : (
          <OverviewCard icon={TrendingUp} title="Progress" value={`75%`} />
        )}
        <OverviewCard icon={FileText} title="Active Assignments" value={3} />
        <OverviewCard icon={HelpCircle} title="Active Quizzes" value={1} />
      </div>

      {isTeacher ? (
        <>
          <Title title="Teacher Insights" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <TeacherPerformanceDistribution />
            <TeacherWorkloadChart />
          </div>
        </>
      ) : (
        <>
          <Title title="Student Insights" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <StudentPerformanceOverTime />
            <StudentActivityBreakdown />
          </div>
        </>
      )}
    </div>
  );
};

export default CourseDashboardPage;
