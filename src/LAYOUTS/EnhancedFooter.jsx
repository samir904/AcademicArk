import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin,Sparkles,Heart, Twitter, Mail, ExternalLink } from 'lucide-react';
import samir from '../../public/samir.jpg'

function EnhancedFooter() {
  return (
    <footer className="bg-black border-t border-white/10 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>
{/* Grid pattern */}
        {/* <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(0deg,transparent_24%,rgb(255,255,255)_25%,rgb(255,255,255)_26%,transparent_27%,transparent_74%,rgb(255,255,255)_75%,rgb(255,255,255)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgb(255,255,255)_25%,rgb(255,255,255)_26%,transparent_27%,transparent_74%,rgb(255,255,255)_75%,rgb(255,255,255)_76%,transparent_77%,transparent)] bg-[length:50px_50px]"></div> */}
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & Description - Enhanced with Developer Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Main Logo Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold text-xl">A</span>
                </div>
                <div>
                  <span className="font-bold text-2xl text-white">
                    AcademicArk
                  </span>
                  <div className="text-sm text-gray-400">
                    Excellence in Learning
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Empowering students with study materials curated for university
                exams. Your journey to academic excellence starts here.
              </p>
            </div>

            {/* Developer/Founder Section - NEW */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
              <h4 className="text-white font-bold text-lg mb-4">
                👨‍💻 Developer & Founder
              </h4>
              
              {/* Developer Card */}
              <div className="flex items-center space-x-4">
                {/* Developer Photo */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-lg hover:shadow-xl transition-shadow">
                    {/* IMPORTANT: Replace 'your-photo-url' with your actual photo URL */}
                    <img
                      src={samir} // Replace with your photo
                      alt="Samir Suman"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Developer Info */}
                <div className="flex-1">
                  <h5 className="text-white font-bold text-base mb-1">
                    Samir Suman
                  </h5>
                  <p className="text-gray-400 text-sm mb-2">
                    Full-Stack Developer • Founder
                  </p>
                  <p className="text-gray-500 text-xs mb-3">
                    Passionate about building educational platforms & creating value for students
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center space-x-3">
                    <a
                      href="https://github.com/samir904" // Replace with your GitHub
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      title="GitHub"
                    >
                      <Github size={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/samirsumanm" // Replace with your LinkedIn
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      title="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                    {/* <a
                      href="https://twitter.com/your-twitter" // Replace with your Twitter
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      title="Twitter"
                    >
                      <Twitter size={16} />
                    </a> */}
                    <a
                      href="mailto:sumansamir3@gmail.com" // Replace with your email
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      title="Email"
                    >
                      <Mail size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Developer Quote/Mission */}
              <div className="mt-4 pt-4 border-t border-blue-500/20">
                <p className="text-gray-300 text-sm italic">
                  "Helping students unlock their potential through better study tools and resources."
                </p>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative">
              Platform
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Browse Notes", path: "/notes" },
                { name: "Search", path: "/search" },
                { name: "AKTU", path: "https://aktu.ac.in/" },
                { name: "Coming Soon", path: "/coming-soon" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                  >
                    {link.name}
                    {link.path.startsWith('http') && (
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative">
              Support
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Help Center", path: "/help" },
                { name: "Contact", path: "/contact" },
                { name: "Privacy", path: "/privacy" },
                { name: "Terms", path: "/terms" },
                { name: "About Developer", path: "/about-developer" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-white/10">
          {/* Footer Stats - Optional */}
          {/* <div className="grid grid-cols-3 gap-8 mb-8 md:mb-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">1K+</div>
              <div className="text-gray-400 text-sm">Students Learning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400 text-sm">Notes Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">4.8★</div>
              <div className="text-gray-400 text-sm">User Rating</div>
            </div>
          </div> */}

         <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-400">© 2025 AcademicArk</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Built with</span>
                <Heart size={14} className="text-red-500 animate-pulse" />
                <span className="text-gray-400">by</span>
                <span className="text-white font-semibold">Samir Suman</span>
              </div>
              
              <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                {/* Empowering the next generation of learners through accessible, high-quality educational resources and a supportive community. */}
              </p>

              {/* Version & Status */}
              <div className="flex items-center justify-center gap-6 pt-4">
                <span className="text-xs text-gray-600">v1.0.0</span>
                {/* <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full "></span>
                  System Operational
                </span> */}
              </div>
            </div>
        </div>
      </div>
    </footer>
  );
}

export default EnhancedFooter;