"use client";
import type React from "react";
import { type ChangeEvent, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/navbar";

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
    <path d="M12 2a5 5 0 0 0-5 5c0 2 2 3 3 4.5 1.5 1.5 2 2.5 2 4.5 0 3-2 5-5 5a5 5 0 0 0 0-10"></path>
    <path d="M12 2a5 5 0 0 1 5 5c0 2-2 3-3 4.5-1.5 1.5-2 2.5-2 4.5 0 3 2 5 5 5a5 5 0 0 0 0-10"></path>
  </svg>
);

interface FormData {
  weight: number;
  gender: string;
  goal: string;
  age: number;
  experience: string;
  healthConditions: string;
}

export default function YogaFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    weight: 0,
    gender: "",
    goal: "",
    age: 0,
    experience: "",
    healthConditions: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "weight" || name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const prompt = `
As a yoga expert, provide personalized yoga asana recommendations for this individual:

PERSONAL DETAILS:
- Weight: ${formData.weight} kg
- Age: ${formData.age} years
- Gender: ${formData.gender}
- Experience Level: ${formData.experience}
- Health Conditions: ${formData.healthConditions || "None specified"}

GOALS:
${formData.goal}

Please recommend:
1. 3-5 specific yoga asanas (poses) that would be most beneficial
2. For each pose, provide:
   - The Sanskrit and English name
   - Brief description of benefits
   - Recommended duration or repetitions
   - Any modifications for beginners
3. A suggested sequence for practicing these poses
4. Any precautions or contraindications

Format your response in a clear, structured way with headings and bullet points.
`;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to get recommendations");
      }

      localStorage.setItem(
        "yogaRecommendation",
        data.choices?.[0]?.message?.content || ""
      );

      router.push("/recc");
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="h-[10vh]">
        <Navbar />
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-xl md:text-2xl text-center text-gray-300 max-w-2xl">
            Discover personalized yoga asanas tailored to your unique body and
            goals
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <YogaIcon />
              <span>Your Profile</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="weight" className="block text-gray-300">
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    name="weight"
                    placeholder="Enter your weight"
                    value={formData.weight || ""}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="age" className="block text-gray-300">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    value={formData.age || ""}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="block text-gray-300">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="experience" className="block text-gray-300">
                  Yoga Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  required
                >
                  <option value="" disabled>
                    Select experience level
                  </option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="goal" className="block text-gray-300">
                  Your Goals
                </label>
                <textarea
                  id="goal"
                  name="goal"
                  placeholder="What do you want to achieve with yoga? (e.g., flexibility, stress relief, strength)"
                  value={formData.goal}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="healthConditions"
                  className="block text-gray-300"
                >
                  Health Conditions (optional)
                </label>
                <textarea
                  id="healthConditions"
                  name="healthConditions"
                  placeholder="Any health conditions or injuries we should know about?"
                  value={formData.healthConditions}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                />
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-400 hover:from-indigo-600 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Getting Recommendations...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Get Personalized Yoga Asanas</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
