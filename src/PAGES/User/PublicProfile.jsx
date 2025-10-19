// src/pages/PublicProfile.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicProfile } from '../../REDUX/Slices/authslice';
import HomeLayout from '../../LAYOUTS/Homelayout';

const GithubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.070 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.770.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.430.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const WebsiteIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

export default function PublicProfile() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { publicProfile, publicProfileLoading } = useSelector(state => state.auth);

  useEffect(() => {
    if (userId) {
      dispatch(getPublicProfile(userId));
    }
  }, [userId, dispatch]);

  if (publicProfileLoading) {
    return (
      <HomeLayout>
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </HomeLayout>
    );
  }

  if (!publicProfile) {
    return (
      <HomeLayout>
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-2">Profile Not Available</h2>
            <p className="text-gray-400 mb-6">This profile is private or doesn't exist</p>
            <Link to="/" className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </HomeLayout>
    );
  }

  const getSocialLinks = () => {
    const links = [];
    if (publicProfile.socialLinks?.github) {
      links.push({ icon: GithubIcon, url: publicProfile.socialLinks.github, label: 'GitHub' });
    }
    if (publicProfile.socialLinks?.linkedin) {
      links.push({ icon: LinkedInIcon, url: publicProfile.socialLinks.linkedin, label: 'LinkedIn' });
    }
    if (publicProfile.socialLinks?.twitter) {
      links.push({ icon: TwitterIcon, url: publicProfile.socialLinks.twitter, label: 'Twitter' });
    }
    if (publicProfile.socialLinks?.website) {
      links.push({ icon: WebsiteIcon, url: publicProfile.socialLinks.website, label: 'Website' });
    }
    return links;
  };

  const socialLinks = getSocialLinks();
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-2xl flex-shrink-0">
                {publicProfile?.avatar?.secure_url?.startsWith('http')  ? (
                  <img
                    src={publicProfile.avatar.secure_url}
                    alt={publicProfile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl">
                    {publicProfile.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold capitalize text-white mb-2">
                  {publicProfile.fullName}
                </h1>
                
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-medium text-sm mb-4">
                  <span className="capitalize">{publicProfile.role?.toLowerCase()}</span>
                </div>

                {publicProfile.bio && (
                  <p className="text-gray-300 text-lg mb-4 max-w-2xl">
                    {publicProfile.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {(publicProfile.role === 'TEACHER' || publicProfile.role === 'ADMIN') && (
                    <div className="bg-white/10 px-4 py-2 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{publicProfile.notesCount || 0}</div>
                      <div className="text-sm text-gray-400">Notes Uploaded</div>
                    </div>
                  )}
                  <div className="bg-white/10 px-4 py-2 rounded-lg">
                    <div className="text-sm text-gray-400">Member Since</div>
                    <div className="text-white font-medium">
                      {publicProfile.createdAt ? formatDate(publicProfile.createdAt) : 'Unknown'}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Connect With Me</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center p-4 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                  >
                    <link.icon className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-gray-300 group-hover:text-white">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Contributions (for teachers/admins) */}
          {(publicProfile.role === 'TEACHER' || publicProfile.role === 'ADMIN') && publicProfile.notesCount > 0 && (
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contributions</h2>
              <p className="text-gray-300">
                {publicProfile.fullName} has contributed <span className="text-blue-400 font-bold">{publicProfile.notesCount}</span> study materials to help students succeed.
              </p>
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
