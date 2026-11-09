import {requirePageRole} from "@/lib/permissions";import Shell from "@/components/shell";import RecordManager from "@/components/record-manager";
export default async function ProjectsPage(){const u=await requirePageRole("student");return <Shell user={u}><RecordManager kind="projects"/></Shell>}
