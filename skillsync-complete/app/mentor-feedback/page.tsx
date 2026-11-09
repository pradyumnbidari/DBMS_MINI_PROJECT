import {requirePageRole} from "@/lib/permissions";import Shell from "@/components/shell";import FeedbackViewer from "@/components/feedback-viewer";
export default async function FeedbackPage(){const u=await requirePageRole("student");return <Shell user={u}><FeedbackViewer/></Shell>}
