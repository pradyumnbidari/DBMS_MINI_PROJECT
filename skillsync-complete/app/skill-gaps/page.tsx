import {requirePageRole} from "@/lib/permissions";
import Shell from "@/components/shell";
import GapExplorer from "@/components/gap-explorer";
export default async function SkillGapPage({searchParams}:{searchParams:Promise<{careerId?:string}>}){const u=await requirePageRole("student");const p=await searchParams;return <Shell user={u}><GapExplorer initialCareerId={Number(p.careerId)||undefined}/></Shell>}
