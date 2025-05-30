import React, { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '@/router'
import Loading from '@/components/Loading'

export default function App() {
  const element = useRoutes(routes)
  return (
    <Suspense fallback={<Loading />}>
      {element}
    </Suspense>
  )
}