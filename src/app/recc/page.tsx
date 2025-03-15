"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { marked } from "marked";

const YogaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a5 5 0 0 0-5 5c0 2 3 3 3 4.5 1.5 1.5 2 2.5 2 4.5 0 3-2 5-5 5a5 5 0 0 0 0-10"></path>
    <path d="M12 2a5 5 0 0 1 5 5c0 2-2 3-3 4.5-1.5 1.5-2 2.5-2 4.5 0 3 2 5 5 5a5 5 0 0 0 0-10"></path>
  </svg>
);

export default function YogaResultsPage() {
  const [recommendation, setRecommendation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedRecommendation = localStorage.getItem("yogaRecommendation");

    async function func() {
      if (storedRecommendation) {
        setRecommendation(await marked.parse(storedRecommendation));
      }
    }

    func();
    setIsLoading(false);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center bg-gradient-to-r from-indigo-300 to-purple-100 bg-clip-text text-transparent mb-4">
            Your Yoga Recommendations
          </h1>
          <h2 className="text-xl md:text-2xl text-center text-gray-300 max-w-2xl">
            Personalized asanas tailored to your unique profile
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold flex items-center gap-2 text-indigo-200">
                <YogaIcon />
                <span>Your Personalized Asanas</span>
              </h3>
              <Link
                href="/yoga-recc"
                className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to Form</span>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-300">Loading your recommendations...</p>
              </div>
            ) : recommendation ? (
              <div className="overflow-y-auto prose prose-invert max-w-none">
                <div
                  className="recommendation-content whitespace-pre-line space-y-6 text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: recommendation }}
                />
                <style jsx global>{`
                  .recommendation-content h1 {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #c7d2fe;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    border-bottom: 1px solid #4b5563;
                    padding-bottom: 0.5rem;
                  }
                  .recommendation-content h2 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: #a5b4fc;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                  }
                  .recommendation-content h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #818cf8;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                  }
                  .recommendation-content p {
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                  }
                  .recommendation-content ul,
                  .recommendation-content ol {
                    padding-left: 3rem;
                    margin-bottom: 1rem;
                  }
                  .recommendation-content li {
                    margin-bottom: 0.5rem;
                  }
                  .recommendation-content li p {
                    padding-left: 0;
                  }
                  .recommendation-content blockquote {
                    border-left: 4px solid #6366f1;
                    padding-left: 1rem;
                    margin-left: 1.5rem;
                    color: #9ca3af;
                  }
                  .recommendation-content strong {
                    color: #e0e7ff;
                    font-weight: 600;
                  }
                `}</style>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 text-center py-12">
                <YogaIcon />
                <p className="text-lg mt-4">
                  No recommendations found. Please go back and complete the
                  form.
                </p>
                <Link
                  href="/yoga-recc"
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-indigo-500 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Back to Form
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
