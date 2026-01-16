import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-hidden">
      {/* Background with cinematic overlay */}
      <div 
        className="absolute inset-x-0 inset-y-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/netflix-bg.png")' }}
      />
      <div className="absolute inset-x-0 inset-y-0 z-10 bg-black/60 netflix-bg-overlay" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col h-screen">
        {/* Simple Top Nav */}
        <header className="flex justify-between items-center px-4 md:px-12 py-6 max-w-7xl mx-auto w-full">
          <Link to="/" className="w-24 md:w-40 text-red-600">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">NETFLIX</h1>
          </Link>
          <Link 
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm md:text-base font-bold transition-colors"
          >
            Sign In
          </Link>
        </header>

        {/* Hero Body */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-7xl font-black leading-tight">
            Unlimited movies, TV shows, and more.
          </h2>
          <p className="text-lg md:text-2xl font-medium">
            Watch anywhere. Cancel anytime.
          </p>
          
          <div className="pt-8 w-full space-y-4">
            <p className="text-lg md:text-xl">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
            
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center max-w-2xl mx-auto w-full">
              <div className="relative h-14 md:h-16 w-full flex-1">
                <input
                  id="cta-email"
                  type="email"
                  placeholder=" "
                  className="peer h-full w-full rounded bg-black/40 border border-white/30 px-5 pt-4 text-base text-white outline-none backdrop-blur-sm focus:border-white transition-all"
                />
                <label 
                  htmlFor="cta-email"
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/70 transition-all peer-focus:top-[12px] peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-[12px] peer-[:not(:placeholder-shown)]:text-[11px]"
                >
                  Email address
                </label>
              </div>
              
              <Link 
                to="/register"
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl font-bold py-3 md:py-4 px-8 rounded flex items-center justify-center gap-2 transition-all active:scale-95 group shrink-0"
              >
                Get Started
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Gradient for section transition if any */}
      <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-[#232323] to-transparent z-10" />
    </div>
  )
}
