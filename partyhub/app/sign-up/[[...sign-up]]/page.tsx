import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(90,15,46,0.3) 0%, #0B0B0C 60%)" }}>
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Dusk Till Dawn</h1>
        <p className="text-xs text-white/50">Join the ultimate party planning platform.</p>
      </div>
      
      <div className="mt-12 w-full max-w-[400px]">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#E5A94A] hover:bg-[#C68A2B] text-black font-bold",
              card: "bg-[#141416] border border-white/10 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-white/60",
              socialButtonsBlockButton: "border-white/10 hover:bg-white/5 text-white bg-[#1A1A1C]",
              socialButtonsBlockButtonText: "text-white",
              dividerLine: "bg-white/10",
              dividerText: "text-white/40",
              formFieldLabel: "text-white/80",
              formFieldInput: "bg-[#1A1A1C] border-white/10 text-white focus:border-[#E5A94A]",
              footerActionText: "text-white/60",
              footerActionLink: "text-[#E5A94A] hover:text-[#C68A2B]",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-[#E5A94A]",
            }
          }}
        />
      </div>
    </main>
  );
}
