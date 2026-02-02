// components/Support/FAQSection.jsx
import React from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Why should I support AcademicArk?",
    a: "Your support helps us maintain high-quality notes, improve performance, and keep the platform ad-free for everyone."
  },
  {
    q: "Is this a subscription?",
    a: "No. This is a one-time support for a fixed duration. No auto-renewals, no surprises."
  },
  {
    q: "What happens after my plan expires?",
    a: "You can still browse notes for free. Downloads will return to the daily free limit."
  },
  {
    q: "Is there a refund?",
    a: "Because this is a digital support product, refunds are generally not provided.If you face any issue or confusion, feel free to reach out — we’ll help."
  }
];

export default function FAQSection() {
  return (
    <div className="max-w-3xl mx-auto mt-20">
      <h2 className="text-xl font-semibold text-white mb-8 text-center">
        Frequently asked questions
      </h2>

      <div className="space-y-4">
        {FAQS.map((item, i) => (
          <details
            key={i}
            className="group bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5"
          >
            <summary className="flex justify-between items-center cursor-pointer text-white">
              <span className="font-medium">{item.q}</span>
              <ChevronDown className="w-4 h-4 text-[#9CA3AF] group-open:rotate-180 transition" />
            </summary>

            <p className="mt-3 text-sm text-[#9CA3AF] leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
