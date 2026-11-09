import Nav from "@/components/nav";
import type { CurrentUser } from "@/lib/permissions";
export default function Shell({user,children}:{user:CurrentUser;children:React.ReactNode}) {
 return <><Nav role={user.role} name={user.fullName}/><main className="mx-auto max-w-7xl space-y-7 px-5 py-9">{children}</main><footer className="mx-auto max-w-7xl px-5 pb-8 text-xs muted">SkillSync academic prototype · Readiness scores and learning hours are illustrative, not validated career predictions.</footer></>;
}
