import { UIMessage } from "ai";
import { Response } from "@/components/ai-elements/response";

export function UserMessage({ message }: { message: UIMessage }) {
    return (
        <div className="whitespace-pre-wrap w-full flex justify-end">
           <div className="max-w-xl w-fit px-4 py-3 rounded-2xl bg-white border border-neutral-300 shadow-sm">
                <div className="text-sm flex flex-col gap-2 items-end">
                    {message.parts.map((part, i) => {
                        switch (part.type) {
                            case "text":
                                return (
                                    <Response key={`${message.id}-${i}`}>
                                        {part.text}
                                    </Response>
                                );

                            case "file": {
                                // Using any due to file part extra fields (mediaType, url, filename)
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const mediaType = (part as any).mediaType as string | undefined;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const url = (part as any).url as string | undefined;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const filename = (part as any).filename as string | undefined;

                                if (mediaType && mediaType.startsWith("image/") && url) {
                                    return (
                                        <img
                                            key={`${message.id}-${i}`}
                                            src={url}
                                            alt={filename || "Uploaded image"}
                                            className="max-h-64 rounded-xl object-contain border border-neutral-200"
                                        />
                                    );
                                }

                                return (
                                    <div
                                        key={`${message.id}-${i}`}
                                        className="text-[11px] px-2 py-1 rounded-full bg-neutral-200 text-neutral-700"
                                    >
                                        📎 {filename || "File attachment"}
                                    </div>
                                );
                            }

                            default:
                                return null;
                        }
                    })}
                </div>
            </div>
        </div>
    );
}
