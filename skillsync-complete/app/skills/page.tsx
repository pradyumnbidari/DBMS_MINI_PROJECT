import {requirePageRole} from "@/lib/permissions";
import Shell from "@/components/shell";
import SkillEditor from "@/components/skill-editor";
export default async function SkillsPage(){const u=await requirePageRole("student");return <Shell user={u}><SkillEditor/></Shell>}
