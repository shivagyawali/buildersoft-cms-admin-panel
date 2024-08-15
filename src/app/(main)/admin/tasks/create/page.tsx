import TaskForm from '@app/components/forms/TaskForm/TaskForm'
import React from 'react'

const CreateTask = () => {
  return (
    <div>
    <p className="text-[#9A93B3] text-2xl">
      Tasks / Create Task
    </p>
    <div className="mt-10">
      <TaskForm />
    </div>
  </div>
  )
}

export default CreateTask
