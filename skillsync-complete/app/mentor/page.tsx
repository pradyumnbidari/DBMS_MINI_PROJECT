import {requirePageRole} from "@/lib/permissions";import Shell from "@/components/shell";import MentorWorkspace from "@/components/mentor-workspace";
export default async function MentorPage(){const u=await requirePageRole("mentor");return <Shell user={u}><MentorWorkspace/></Shell>}
