import Link from "next/link";
import { 
  LayoutDashboard, 
  Zap, 
  Users, 
  ArrowRight,
  Star,
  Shield,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">TaskFlow</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
              <a href="#testimonials" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 mb-8">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">Smart Task Management Made Simple</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
            Organize your work,
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              achieve your goals
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskFlow helps teams and individuals stay organized with intuitive Kanban boards, 
            smart task management, and seamless collaboration.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/signup" 
              className="group flex items-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 px-8 py-4 rounded-xl transition-all shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#how-it-works" 
              className="flex items-center gap-2 text-base font-semibold text-slate-700 hover:text-slate-900 px-8 py-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all hover:bg-slate-50"
            >
              See How It Works
            </Link>
          </div>

          {/* Hero Image / App Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-md px-4 py-1 text-xs text-slate-400">taskflow.app/dashboard</div>
                </div>
              </div>
              {/* App preview */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="flex gap-4">
                  {/* Sidebar mock */}
                  <div className="w-48 bg-white rounded-lg p-3 shadow-sm hidden sm:block">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-purple-600" />
                      <div className="h-3 w-16 bg-slate-200 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-violet-50 rounded" />
                      <div className="h-8 bg-slate-50 rounded" />
                      <div className="h-8 bg-slate-50 rounded" />
                    </div>
                  </div>
                  {/* Kanban mock */}
                  <div className="flex-1 flex gap-3 overflow-hidden">
                    {["To Do", "In Progress", "Done"].map((col, i) => (
                      <div key={col} className="flex-1 min-w-0">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-violet-500" : i === 1 ? "bg-purple-500" : "bg-indigo-500"}`} />
                            <span className="text-xs font-medium text-slate-700">{col}</span>
                            <span className="text-xs text-slate-400 ml-auto">{3 - i}</span>
                          </div>
                          <div className="space-y-2">
                            {Array.from({ length: 3 - i }).map((_, j) => (
                              <div key={j} className="bg-slate-50 rounded p-2 border border-slate-100">
                                <div className="h-2 w-full bg-slate-200 rounded mb-1.5" />
                                <div className="h-2 w-2/3 bg-slate-100 rounded" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Trust Section */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 mb-8">Trusted by teams at leading companies</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50">
            {["Google", "Microsoft", "Spotify", "Airbnb", "Netflix"].map((company) => (
              <span key={company} className="text-xl font-bold text-slate-400">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to stay productive
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks efficiently and collaborate seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: LayoutDashboard,
                title: "Kanban Boards",
                description: "Visualize your workflow with intuitive drag-and-drop boards that adapt to your process.",
                color: "violet"
              },
              {
                icon: Zap,
                title: "Smart Automation",
                description: "Automate repetitive tasks and focus on what matters most with intelligent workflows.",
                color: "purple"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Work together in real-time with comments, mentions, and shared workspaces.",
                color: "indigo"
              },
              {
                icon: Clock,
                title: "Time Tracking",
                description: "Track time spent on tasks and get insights into your productivity patterns.",
                color: "violet"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your data is encrypted and protected with enterprise-grade security measures.",
                color: "purple"
              },
              {
                icon: Star,
                title: "Priority Management",
                description: "Set priorities, due dates, and labels to keep important tasks front and center.",
                color: "indigo"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Get started in minutes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to transform how you manage your tasks and projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create your workspace",
                description: "Sign up and create your first workspace in seconds. Invite your team or start solo."
              },
              {
                step: "02",
                title: "Build your boards",
                description: "Create boards for different projects. Add lists and customize your workflow."
              },
              {
                step: "03",
                title: "Start collaborating",
                description: "Add tasks, assign team members, and track progress in real-time."
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-violet-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-violet-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Loved by teams everywhere
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See what our users have to say about transforming their productivity with TaskFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "TaskFlow has completely transformed how our team manages projects. The Kanban boards are intuitive and the collaboration features are top-notch.",
                author: "Sarah Chen",
                role: "Product Manager",
                company: "TechCorp"
              },
              {
                quote: "I&apos;ve tried dozens of task management tools, but TaskFlow is the first one that actually stuck. It&apos;s simple yet powerful.",
                author: "Michael Rodriguez",
                role: "Freelance Designer",
                company: "Self-employed"
              },
              {
                quote: "The clean interface and smart features make TaskFlow a joy to use. Our team productivity has increased by 40% since we started using it.",
                author: "Emily Watson",
                role: "Engineering Lead",
                company: "StartupXYZ"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-medium">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-12 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to boost your productivity?
              </h2>
              <p className="text-lg text-violet-100 mb-8 max-w-xl mx-auto">
                Join thousands of teams and individuals who use TaskFlow to organize their work and achieve their goals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/signup" 
                  className="group flex items-center gap-2 text-base font-semibold text-violet-600 bg-white hover:bg-violet-50 px-8 py-4 rounded-xl transition-all shadow-xl hover:-translate-y-0.5"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <p className="text-sm text-violet-200 mt-4">No credit card required · Free forever for individuals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">TaskFlow</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
            </div>

            <p className="text-sm text-slate-500">
              © 2024 TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
