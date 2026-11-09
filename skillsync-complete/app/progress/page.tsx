import {requirePageRole} from "@/lib/permissions";import Shell from "@/components/shell";import ProgressTracker from "@/components/progress-tracker";
export default async function ProgressPage(){const u=await requirePageRole("student");return <Shell user={u}><ProgressTracker/></Shell>}
