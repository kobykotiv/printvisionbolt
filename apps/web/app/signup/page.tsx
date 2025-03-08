import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { AuthForm } from "@/components/auth/auth-form"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground">
              Start automating your print-on-demand business
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <AuthForm mode="signup" />
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
