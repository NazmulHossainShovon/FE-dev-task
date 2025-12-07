import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function OnboardingHeader() {
  return (
    <div className="px-8 py-6 flex justify-center">
      <div className="w-full max-w-md">
        <Link to={createPageUrl("Home")}>
          <img
            src="https://cdn.geo.elelem.ai/onboarding/91638358f_elelem2025logoPrimary.png"
            alt="elelem"
            className="h-8 cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>
    </div>
  );
}
