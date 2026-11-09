import { requirePageRole } from "@/lib/permissions";
import Shell from "@/components/shell";
import StudentDashboard from "@/components/student-dashboard";
export default async function DashboardPage(){const user=await requirePageRole("student");return <Shell user={user}><StudentDashboard name={user.fullName}/></Shell>}
