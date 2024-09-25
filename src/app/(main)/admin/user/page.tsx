import TableContent from '@app/components/TableContent'
import { tasks } from '@app/constants/options'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='flex items-center justify-between'>
      <p className="text-3xl text-[#0E2040]">Users</p>
        <Link href={"/admin/user/create"} className="px-[20px] py-[8px] text-lg text-white bg-[#036EFF] rounded-2xl">
          Create User
        </Link>
      </div>
     
     <TableContent data={tasks} />
    </div>
  )
}

export default page
