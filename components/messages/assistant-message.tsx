import { UIMessage } from "ai";
import { Response } from "@/components/ai-elements/response";

type Scheme = {
  name: string;
  issuingAuthority: string;
  eligibilitySummary: string;
  eligibilityScore: number;
  benefits: string;
  applicationUrl: string;
  guidePrompt: string;
};

function extractSchemesFromText(text: string): {
  schemes: Scheme[] | null;
  cleanedText: string;
} {
  const jsonBlockRegex = /```json([\s\S]*?)```/;
  const match = text.match(jsonBlockRegex);

  if (!match) {
    return { schemes: null, cleanedText: text };
  }

  const jsonString = match[1].trim();
  try {
    const parsed = JSON.parse(jsonString) as { schemes?: Scheme[] };
    const schemes = parsed.schemes ?? null;
    const cleanedText = text.replace(jsonBlockRegex, "").trim();
    return { schemes, cleanedText };
  } catch (e) {
    console.error("Failed to parse schemes JSON", e);
    return { schemes: null, cleanedText: text };
  }
}

function SchemeCard({ scheme, onGuideClick }: { scheme: Scheme; onGuideClick: (prompt: string) => void }) {
  return (
    <div className="w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm space-y-2">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h3 className="text-sm font-semibold">{scheme.name}</h3>
          <p className="text-xs text-neutral-600">
            Issuing authority: {scheme.issuingAuthority || "Not specified"}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-neutral-500">Eligibility score</span>
          <span className="text-xs font-semibold">
            {scheme.eligibilityScore}/10
          </span>
        </div>
      </div>

      <div className="text-xs text-neutral-800 space-y-1">
        <p>
          <span className="font-semibold">Eligibility match: </span>
          {scheme.eligibilitySummary}
        </p>
        <p>
          <span className="font-semibold">Benefits: </span>
          {scheme.benefits}
        </p>
      </div>

      <div className="flex justify-between items-center pt-2 gap-2">
        {scheme.applicationUrl ? (
          <a
            href={scheme.applicationUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium underline"
          >
            Application link
          </a>
        ) : (
          <span className="text-[11px] text-neutral-500">
            No official link available
          </span>
        )}

        <button
          className="text-[11px] px-3 py-1 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition"
          onClick={() => onGuideClick(scheme.guidePrompt || `Guide me on applying for ${scheme.name}`)}
        >
          Guide me on applying
        </button>
      </div>
    </div>
  );
}

export function AssistantMessage({ message, onGuide }: { message: UIMessage; onGuide?: (prompt: string) => void }) {
  // Merge all text parts into one string
  const fullText = message.parts
    .filter((part) => part.type === "text")
    .map((part) => "text" in part ? part.text : "")
    .join("\n\n");

  const { schemes, cleanedText } = extractSchemesFromText(fullText);

  const handleGuide = (prompt: string) => {
    if (onGuide) {
      onGuide(prompt);
    }
  };

  return (
    <div className="whitespace-pre-wrap w-full flex justify-start">
      <div className="max-w-xl w-fit px-4 py-3 rounded-[20px] bg-white border border-neutral-200 space-y-3">
        {cleanedText && (
          <div className="text-sm">
            <Response>{cleanedText}</Response>
          </div>
        )}

        {schemes && schemes.length > 0 && (
          <div className="space-y-2">
            {schemes.map((scheme, idx) => (
              <SchemeCard
                key={`${message.id}-scheme-${idx}`}
                scheme={scheme}
                onGuideClick={handleGuide}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
