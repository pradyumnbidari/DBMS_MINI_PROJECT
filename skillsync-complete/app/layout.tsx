import "./globals.css";
export const metadata = { title: "SkillSync | Career & Skill Portal", description: "Student career readiness and mentor guidance" };
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}</body></html>;
}
