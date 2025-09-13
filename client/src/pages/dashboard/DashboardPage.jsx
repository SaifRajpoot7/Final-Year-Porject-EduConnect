import React from "react";
import OverviewCard from "../../components/OverviewCard";
import { BookOpen, CalendarDays, FileText, HelpCircle } from "lucide-react";
import StudentPerformanceOverTime from "../../components/StudentPerformanceOverTime";
import StudentActivityBreakdown from "../../components/StudentActivityBreakdown";
import TeacherPerformanceDistribution from "../../components/TeacherPerformanceDistribution";
import TeacherWorkloadChart from "../../components/TeacherWorkloadChart";
import PageTitle from "../../components/other/PageTitle";
import Title from "../../components/other/Title";

const DashboardPage = () => {

  return (
    <div className="p-2 min-h-screen">
      <PageTitle title="Dashboard Overview" subtitle="Track your progress, courses, assignments, and performance insight" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        <OverviewCard icon={BookOpen} title="Total Courses" value={8} />
        <OverviewCard icon={FileText} title="Active Assignments" value={3} />
        <OverviewCard icon={CalendarDays} title="Upcoming Lectures(Today)" value={2} />
        <OverviewCard icon={HelpCircle} title="Active Quizzes" value={1} />
      </div>
      <Title title="Student Insights" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <StudentPerformanceOverTime />
        <StudentActivityBreakdown />
      </div>
      <Title title="Teacher Insights" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <TeacherPerformanceDistribution />
        <TeacherWorkloadChart />
      </div>
    </div>
  );
};

export default DashboardPage;
