import React from 'react';
import { Sparkles, Check, Users, Globe, BarChart3, Edit } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Smart Suggestions",
      description: "Improves suggestions and optimizes ideas.",
      color: "bg-purple-500"
    },
    {
      icon: <Check className="w-6 h-6" />,
      title: "Grammar & Style Fixes",
      description: "Provides consistent-rating grammar & style fixes.",
      color: "bg-blue-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Rewrite & Summarize",
      description: "Rewrite and summarize entire articles.",
      color: "bg-indigo-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multilingual Support",
      description: "Supports in languages and team collaboration.",
      color: "bg-purple-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Collaboration collaboration collaboration.",
      color: "bg-blue-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Improve auroutitivnitee in arecprcora.",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <nav className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Edit className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold">AI Writing Assistant</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link href="#feature" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="/auth" className="text-gray-300 hover:text-white transition-colors">Get Started</Link>
          </div>
          <Link href="/auth">
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-3xl font-medium transition-colors">
            Get Started
          </button>
          </Link>
          
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Write Better,
                <br />
                Smarter, and
                <br />
                Faster <span className="inline-block animate-bounce">✋</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Get AI-powered assistance with smart suggestions, grammar checks, and more 
                to enhance your writing and boost productivity.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-transparent border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-3xl font-medium transition-all duration-300">
                Try the Demo
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-3xl font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Laptop Mockup */}
          <div className="relative">
            <div className="relative bg-gray-800 rounded-t-2xl p-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-lg p-8 h-80">
                <div className="space-y-4">
                  <div className="h-4 bg-purple-400 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20" id='feature'>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Features That Empower
              <br />
              Your Writing
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
     

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© 2025 AI Writing Assistant. All rights reserved.</p>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
}