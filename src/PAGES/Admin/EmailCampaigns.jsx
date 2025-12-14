import React, { useState, useEffect } from "react";
import axiosInstance from "../../HELPERS/axiosInstance";
import { showToast } from "../../HELPERS/Toaster";

const EmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sendingDaily, setSendingDaily] = useState(false); // ✅ NEW STATE
  const [formData, setFormData] = useState({
    campaignName: "",
    subject: "",
    message: "",
    ctaText: "",
    ctaLink: "",
    targetRole: "ALL",
    dailyLimit: 100,
    headerImage: "",
    logo: "",
    features: [
      { icon: "✨", title: "", description: "" },
      { icon: "📊", title: "", description: "" },
    ],
    screenshots: [
      { title: "", description: "", imageUrl: "" },
      { title: "", description: "", imageUrl: "" },
      { title: "", description: "", imageUrl: "" },
    ],
  });

  // ✅ DEFAULT FORM STATE
  const DEFAULT_FORM_DATA = {
    campaignName: "",
    subject: "",
    message: "",
    ctaText: "",
    ctaLink: "",
    targetRole: "ALL",
    dailyLimit: 100,
    headerImage: "",
    logo: "",
    features: [
      { icon: "✨", title: "", description: "" },
      { icon: "📊", title: "", description: "" },
    ],
    screenshots: [
      { title: "", description: "", imageUrl: "" },
      { title: "", description: "", imageUrl: "" },
      { title: "", description: "", imageUrl: "" },
    ],
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/campaign/list");
      setCampaigns(res.data.data);
    } catch (error) {
      showToast.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      const httpPromise = axiosInstance.post(
        "/admin/campaign/create",
        formData
      );
      const res = await showToast.promise(httpPromise, {
        loading: "Creating campaign...",
        success: "Campaign created successfully!",
        error: "Failed to create campaign",
      });

      setFormData(DEFAULT_FORM_DATA);
      setShowForm(false);
      fetchCampaigns();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ NEW: SEND DAILY CAMPAIGN EMAILS
  const handleSendDailyCampaigns = async () => {
    try {
      setSendingDaily(true);
      const httpPromise = axiosInstance.post("/admin/campaign/send-daily");
      
      const res = await showToast.promise(httpPromise, {
        loading: "📧 Sending daily campaign emails...",
        success: `✅ Daily emails sent successfully! ${res.data?.data?.totalSent} sent, ${res.data?.data?.totalFailed} failed`,
        error: "Failed to send daily campaigns",
      });

      // ✅ Refresh campaigns to show updated status
      fetchCampaigns();
    } catch (error) {
      console.error("Error sending daily campaigns:", error);
      showToast.error(error.response?.data?.message || "Failed to send emails");
    } finally {
      setSendingDaily(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* ✅ UPDATED HEADER with Send Daily Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              📅 Email Campaigns
            </h1>
            <p className="text-slate-400 mt-2">
              Apple-style campaigns with mobile screenshots
            </p>
          </div>
          <div className="flex gap-3">
            {/* ✅ NEW: SEND DAILY BUTTON */}
            <button
              onClick={handleSendDailyCampaigns}
              disabled={sendingDaily || campaigns.length === 0}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sendingDaily ? (
                <>
                  <span className="animate-spin">⏳</span> Sending...
                </>
              ) : (
                <>
                  <span>📬</span> Send Daily
                </>
              )}
            </button>
            
            {/* Create Campaign Button */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition"
            >
              {showForm ? "✕ Cancel" : "+ New Campaign"}
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <form
            onSubmit={handleCreateCampaign}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8 mb-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Campaign Name */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) =>
                  setFormData({ ...formData, campaignName: e.target.value })
                }
                placeholder="e.g., AKTU Exam Motivation - Download Notes"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Header Image URL */}
            <div>
              <label className="block text-white font-semibold mb-2">
                🖼️ Header Image URL (600x300px recommended)
              </label>
              <input
                type="url"
                value={formData.headerImage}
                onChange={(e) =>
                  setFormData({ ...formData, headerImage: e.target.value })
                }
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.headerImage && (
                <div className="mt-3">
                  <p className="text-xs text-slate-300 mb-2">Header Preview:</p>
                  <img
                    src={formData.headerImage}
                    alt="Header Preview"
                    className="w-full h-40 object-cover rounded-lg border border-white/20"
                    onError={(e) => {
                      e.target.style.background = "#333";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-white font-semibold mb-2">
                📌 Logo URL (optional)
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-white font-semibold mb-4">
                ✨ Key Features (Optional)
              </label>
              {formData.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="mb-4 p-4 bg-white/5 border border-white/20 rounded-lg"
                >
                  <p className="text-white text-xs font-semibold mb-2 opacity-70">
                    Feature {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Icon (e.g., ✨)"
                      value={feature.icon}
                      onChange={(e) => {
                        const newFeatures = [...formData.features];
                        newFeatures[idx].icon = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...formData.features];
                        newFeatures[idx].title = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={feature.description}
                      onChange={(e) => {
                        const newFeatures = [...formData.features];
                        newFeatures[idx].description = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-white font-semibold mb-4">
                📱 Feature Screenshots (Portrait/Mobile Size)
              </label>
              <p className="text-xs text-slate-400 mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                💡 Upload mobile app screenshots to Cloudinary (portrait 9:19.5
                aspect ratio). They'll display beautifully centered like iPhone
                screens!
              </p>
              {formData.screenshots.map((screenshot, idx) => (
                <div
                  key={idx}
                  className="mb-6 p-4 bg-white/5 border border-white/20 rounded-lg"
                >
                  <p className="text-white text-sm font-semibold mb-3">
                    📸 Screenshot {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      placeholder="Screenshot Title"
                      value={screenshot.title}
                      onChange={(e) => {
                        const newScreenshots = [...formData.screenshots];
                        newScreenshots[idx].title = e.target.value;
                        setFormData({
                          ...formData,
                          screenshots: newScreenshots,
                        });
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <textarea
                      placeholder="Description (what does this screenshot show?)"
                      value={screenshot.description}
                      onChange={(e) => {
                        const newScreenshots = [...formData.screenshots];
                        newScreenshots[idx].description = e.target.value;
                        setFormData({
                          ...formData,
                          screenshots: newScreenshots,
                        });
                      }}
                      rows={2}
                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />

                    <input
                      type="url"
                      placeholder="Cloudinary Image URL (portrait screenshot)"
                      value={screenshot.imageUrl}
                      onChange={(e) => {
                        const newScreenshots = [...formData.screenshots];
                        newScreenshots[idx].imageUrl = e.target.value;
                        setFormData({
                          ...formData,
                          screenshots: newScreenshots,
                        });
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {screenshot.imageUrl && (
                      <div className="mt-2 flex flex-col items-center">
                        <p className="text-xs text-slate-300 mb-2 w-full text-left">
                          Preview (Portrait):
                        </p>
                        <div
                          className="w-32 rounded-2xl border border-white/20 overflow-hidden"
                          style={{
                            aspectRatio: "9/19.5",
                            background: "#000",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                          }}
                        >
                          <img
                            src={screenshot.imageUrl}
                            alt={screenshot.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.alt = "Failed to load";
                              e.target.style.background = "#333";
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Aspect ratio: 9:19.5 (Mobile)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Target Audience
                </label>
                <select
                  value={formData.targetRole}
                  onChange={(e) =>
                    setFormData({ ...formData, targetRole: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option className="bg-gray-900" value="ALL">
                    All Users
                  </option>
                  <option className="bg-gray-900" value="USER">
                    Users Only
                  </option>
                  <option className="bg-gray-900" value="TEACHER">
                    Teachers Only
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">
                  Daily Limit (emails/day)
                </label>
                <input
                  type="number"
                  value={formData.dailyLimit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyLimit: parseInt(e.target.value),
                    })
                  }
                  min="10"
                  max="300"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="e.g., 📚 AKTU Exam Alert: Download Study Notes NOW"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Message (shown in header)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Brief intro message..."
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* CTA Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaText: e.target.value })
                  }
                  placeholder="e.g., Download Study Notes"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">
                  Button Link
                </label>
                <input
                  type="url"
                  value={formData.ctaLink}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaLink: e.target.value })
                  }
                  placeholder="https://academicark.com/notes"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition"
            >
              📧 Create Campaign
            </button>
          </form>
        )}

        {/* ✅ INFO BOX - How to Send Daily Emails */}
        {campaigns.length > 0 && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <p className="text-green-300 text-sm font-semibold">
              ✅ TIP: Click "📬 Send Daily" button above to send pending campaign emails to today's batch of users!
            </p>
          </div>
        )}

        {/* Campaigns List */}
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No campaigns yet. Create one to get started!
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
              >
                {/* Campaign preview with image */}
                {campaign.headerImage && (
                  <img
                    src={campaign.headerImage}
                    alt={campaign.campaignName}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-bold text-white mb-2">
                  {campaign.campaignName}
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  {campaign.subject}
                </p>

                {/* ✅ Status Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      campaign.status === "completed"
                        ? "bg-green-500/20 text-green-300"
                        : campaign.status === "scheduled"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {campaign.status.toUpperCase()}
                  </span>
                  {campaign.pendingUsers && campaign.pendingUsers.length > 0 && (
                    <span className="text-xs text-yellow-300 font-semibold">
                      📬 {campaign.pendingUsers.length} pending
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        campaign.totalUsers > 0
                          ? (campaign.sentCount / campaign.totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400">
                  {campaign.sentCount}/{campaign.totalUsers} sent •{" "}
                  <span className="text-red-300 ml-1">
                    {campaign.failedCount || 0} failed
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailCampaigns;
