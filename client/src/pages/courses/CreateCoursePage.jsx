import React from 'react'
import CreateCourseForm from "../../components/CreateCourseForm";
import PageTitle from '../../components/other/PageTitle';

const CreateCoursePage = () => {
  return (
    <div className="p-2 min-h-screen">
        <PageTitle
        title="Create New Courses"
        subtitle=""
      />
      <CreateCourseForm />
    </div>
  )
}

export default CreateCoursePage
