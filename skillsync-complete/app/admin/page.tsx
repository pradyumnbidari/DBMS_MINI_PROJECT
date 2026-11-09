import {requirePageRole} from "@/lib/permissions";import Shell from "@/components/shell";import AdminWorkspace from "@/components/admin-workspace";
export default async function AdminPage(){const u=await requirePageRole("admin");return <Shell user={u}><AdminWorkspace/></Shell>}
