import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Heart, Mail, ExternalLink, ArrowRight } from 'lucide-react';
import samir from '../../public/samir.jpg'


function EnhancedFooter() {
  const currentYear = new Date().getFullYear();


  return (
    <footer className="bg-black border-t border-white/10 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>


      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Top Section - Logo & Developer */}
       


        {/* Links Section - Desktop Grid / Mobile Collapse */}
        <div className="mb-12 md:mb-16">
          {/* Desktop View - Grid */}
          <div className="hidden md:grid grid-cols-3 gap-12">
            
            {/* Platform Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-5 relative pb-2">
                Platform
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Browse Notes", path: "/notes" },
                  { name: "Downloads", path: "/downloads" },
                  { name: "AKTU Official", path: "https://aktu.ac.in/", external: true },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.path}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group"
                    >
                      {link.name}
                      {link.external && (
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-5 relative pb-2">
                Support
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Help Center", path: "/help" },
                  { name: "Contact", path: "/contact" },
                  { name: "Report Issue", path: "/report" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-5 relative pb-2">
                Legal
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Privacy Policy", path: "/privacy" },
                  { name: "Terms of Service", path: "/terms" },
                  { name: "About Developer", path: "/about-developer" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile View - Collapsible Accordion */}
          <div className="md:hidden space-y-3">
            {[
              {
                title: "Platform",
                gradient: "from-blue-500 to-purple-500",
                links: [
                  { name: "Browse Notes", path: "/notes" },
                  { name: "Downloads", path: "/downloads" },
                  { name: "AKTU Official", path: "https://aktu.ac.in/", external: true },
                ]
              },
              {
                title: "Support",
                gradient: "from-purple-500 to-pink-500",
                links: [
                  { name: "Help Center", path: "/help" },
                  { name: "Contact", path: "/contact" },
                  { name: "Report Issue", path: "/report" },
                ]
              },
              {
                title: "Legal",
                gradient: "from-pink-500 to-orange-500",
                links: [
                  { name: "Privacy Policy", path: "/privacy" },
                  { name: "Terms of Service", path: "/terms" },
                  { name: "About Developer", path: "/about-developer" },
                ]
              }
            ].map((section, index) => (
              <details key={section.title} className="group">
                <summary className="cursor-pointer text-white font-bold text-base pb-2 relative flex items-center justify-between hover:text-gray-300 transition-colors">
                  <span>{section.title}</span>
                  <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <ul className="space-y-2 pt-3 pl-2 border-l border-white/10">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white text-sm transition-all duration-300 inline-flex items-center gap-2 group"
                        >
                          {link.name}
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="text-gray-400 hover:text-white text-sm transition-all duration-300 inline-block"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>


     {/* Developer Card Section */}
<div className="border-t border-white/10 pt-8 md:pt-12 mb-8 md:mb-12">
  <div className="max-w-lg mx-auto">
    <div className="flex items-center gap-4">
      {/* Developer Image */}
      <img
        src={samir}
        alt="Samir Suman"
        className="w-14 h-14 rounded-full object-cover border border-white/10 flex-shrink-0"
      />

      {/* Developer Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm">Samir Suman</h4>
        <p className="text-white/40 text-xs">Full Stack Developer</p>
      </div>

      {/* Social Links */}
      <div className="flex gap-2 flex-shrink-0">
        <a href="https://github.com/samir904" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
          <Github size={16} />
        </a>
        <a href="https://www.linkedin.com/in/samirsumanm/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
          <Linkedin size={16} />
        </a>
        <a href="mailto:sumansamir@gmail.com" className="text-white/30 hover:text-white transition-colors">
          <Mail size={16} />
        </a>
      </div>
    </div>
  </div>
</div>
        {/* Bottom Divider */}
        <div className="border-t border-white/10 pt-8 md:pt-12">
          {/* Footer Bottom */}
          <div className="space-y-6 md:space-y-4">
            
            {/* Copyright & Attribution */}
            <div className="text-center space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs md:text-sm text-gray-400">
                <span>© {currentYear} AcademicArk</span>
                <span className="hidden sm:inline text-gray-600">•</span>
                <span className="flex items-center gap-1.5">
                  Built with
                  <Heart size={14} className="text-red-500 animate-pulse" />
                  by
                  <span className="text-white font-semibold">Samir Suman</span>
                </span>
              </div>


              {/* Status */}
              <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                <span>v1.0.0</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-green-400">All Systems Operational</span>
                </span>
              </div>
            </div>


            {/* CTA Button - Optional */}
            <div className="flex items-center justify-center pt-4">
              <Link
                to="/notes"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Start Exploring
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


export default EnhancedFooter;