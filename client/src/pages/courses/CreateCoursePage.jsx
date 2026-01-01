import React from 'react'
import CreateCourseForm from "../../components/CreateCourseForm";
import PageTitle from '../../components/other/PageTitle';

const CreateCoursePage = () => {
  return (
    <div className="p-2">
        <PageTitle
        title="Create Course"
        subtitle=""
      />
      <CreateCourseForm />
    </div>
  )
}

export default CreateCoursePage
