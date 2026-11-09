import {requirePageRole} from "@/lib/permissions";import Shell from "@/components/shell";import HistoryViewer from "@/components/history-viewer";
export default async function HistoryPage(){const u=await requirePageRole("student");return <Shell user={u}><HistoryViewer/></Shell>}
