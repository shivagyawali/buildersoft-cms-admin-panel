import MainLayout from '@app/layouts/MainLayout'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
      <MainLayout>{children}</MainLayout>
    </div>
  )
}

export default layout
