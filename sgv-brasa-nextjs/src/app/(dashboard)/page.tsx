import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { getDashboardData } from './actions'
import { addDays, format } from 'date-fns'

export default async function DashboardPage() {
  // Fetch initial data for the last 30 days
  const fechaDesde = format(addDays(new Date(), -30), 'yyyy-MM-dd')
  const fechaHasta = format(new Date(), 'yyyy-MM-dd')

  const initialData = await getDashboardData(fechaDesde, fechaHasta)

  return <DashboardClient initialData={initialData} />
}
