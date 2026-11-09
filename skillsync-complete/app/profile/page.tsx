import {requirePageRole} from "@/lib/permissions";import Shell from "@/components/shell";import ProfileEditor from "@/components/profile-editor";
export default async function ProfilePage(){const u=await requirePageRole("student");return <Shell user={u}><ProfileEditor/></Shell>}
