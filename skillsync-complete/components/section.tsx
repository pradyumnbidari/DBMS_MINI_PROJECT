export default function Section({title,subtitle,children}:{title:string;subtitle?:string;children:React.ReactNode}) {
 return <section className="panel space-y-4"><div><h2 className="text-xl font-bold">{title}</h2>{subtitle && <p className="muted mt-1 text-sm">{subtitle}</p>}</div>{children}</section>;
}
