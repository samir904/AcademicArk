import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useSeo from "../../hooks/useSeo";
import Breadcrumb from "../../COMPONENTS/SEO/Breadcrumb";
import StatsBar from "../../COMPONENTS/SEO/StatsBar";
import NotesGrid from "../../COMPONENTS/SEO/NotesGrid";
import FAQSection from "../../COMPONENTS/SEO/FAQSection";
import InternalLinks from "../../COMPONENTS/SEO/InternalLinks";
import { NotesSkeleton } from "../../COMPONENTS/Skeletons";
import axiosInstance from "../../HELPERS/axiosInstance";

export default function SeoDynamicPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/seo/${slug}`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError("Page not found");
        }
      } catch (err) {
        console.error("❌ SEO Page Load Error:", err);
        setError(err.response?.data?.message || "Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  // 🔥 Apply SEO meta tags
  useSeo(data?.seo);

  // 📊 Loading State
  if (loading) {
    return <NotesSkeleton />;
  }

  // ❌ Error State
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-6">{error || "This page doesn't exist"}</p>
          <button
            onClick={() => window.location.href = '/notes'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Browse All Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* 🔗 Breadcrumb Navigation */}
        <Breadcrumb filters={data.filters} slug={slug} />

        {/* 🏆 HERO SECTION */}
        <section className="mt-6 mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {data.seo.h1}
          </h1>

          {/* 📝 Intro Content - Paragraph by Paragraph */}
          <div className="prose prose-invert max-w-none">
            {data.seo.introContent.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* 📊 Stats Bar */}
        <StatsBar stats={data.stats} />

        {/* 📚 Notes Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              📖 Available Study Material
            </h2>
            <span className="text-sm text-gray-400">
              {data.stats.totalNotes} resources found
            </span>
          </div>

          {data.notes.length > 0 ? (
            <NotesGrid notes={data.notes} />
          ) : (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-400 text-lg mb-2">No notes available yet</p>
              <p className="text-gray-500 text-sm">Check back soon for updates!</p>
            </div>
          )}
        </section>

        {/* 🔗 Internal Links (Related Pages) */}
        <InternalLinks currentSlug={slug} pageType={data.seo.pageType} />

        {/* ❓ FAQ Section */}
        <FAQSection faqs={data.seo.faqs} />

        {/* 📌 Bottom CTA */}
        <section className="mt-16 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Need More Study Material?
          </h3>
          <p className="text-gray-300 mb-6">
            Explore our complete collection of AKTU notes, PYQs, and handwritten notes
          </p>
          <button
            onClick={() => window.location.href = '/notes'}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Browse All Notes
          </button>
        </section>

      </div>
    </div>
  );
}
