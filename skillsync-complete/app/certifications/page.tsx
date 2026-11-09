import {requirePageRole} from "@/lib/permissions";import Shell from "@/components/shell";import RecordManager from "@/components/record-manager";
export default async function CertificationsPage(){const u=await requirePageRole("student");return <Shell user={u}><RecordManager kind="certifications"/></Shell>}
