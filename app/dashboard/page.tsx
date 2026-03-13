import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  // Get user profile to determine role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  
  // Redirect based on user role
  const role = profile?.role || "student"
  
  switch (role) {
    case "admin":
      redirect("/dashboard/admin")
    case "teacher":
      redirect("/dashboard/teacher")
    case "parent":
      redirect("/dashboard/parent")
    case "student":
    default:
      redirect("/dashboard/student")
  }
}
