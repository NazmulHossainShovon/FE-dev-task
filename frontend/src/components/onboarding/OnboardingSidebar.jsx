import { Search, TrendingUp, Target, Lightbulb } from "lucide-react";

export default function OnboardingSidebar() {
  return (
    <div
      className="hidden lg:flex w-1/2 items-start justify-center p-12 pt-32 relative overflow-hidden"
      style={{
        backgroundImage:
          "url(https://cdn.geo.elelem.ai/onboarding/95909b4b7_elelembackground.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-xl relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            The elelem 4-step route to winning
            <br />
            in AI Search
          </h3>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E8B8B] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-[#1E8B8B]" />
              </div>
              <p>Find the questions your audience is asking</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E8B8B] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#1E8B8B]" />
              </div>
              <p>See your brand's AI Search visibility vs Competitors</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E8B8B] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-[#1E8B8B]" />
              </div>
              <p>Identify high-value, high-intent questions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E8B8B] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-[#1E8B8B]" />
              </div>
              <p>How to optimize your content to boost visibility</p>
            </div>
            <p className="mt-6">
              Then simply publish and expose your content to LLMs and
              transparently track the results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
