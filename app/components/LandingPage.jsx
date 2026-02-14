"use client";
import { useState } from "react";

export default function LandingPage() {
  const [product, setProduct] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateCopy = () => {
    if (!product) return;
    setIsLoading(true);

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [
          {
            role: "system",
            content:
              "You are a professional landing page copy.",
          },
          {
            role: "user",
            content: `Create landing page copy for this product/service: ${product}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "landing_page_copy_output",
            schema: {
              type: "object",
              properties: {
                headline: {
                  type: "string",
                  description: "Main attention-grabbing headline",
                },
                subheadline: {
                  type: "string",
                  description: "Supporting subheadline explaining value",
                },
                value_proposition: {
                  type: "string",
                  description: "Clear explanation of benefits and outcome",
                },
                key_features: {
                  type: "string",
                  description: "Bullet-style key features separated by commas",
                },
                call_to_action: {
                  type: "string",
                  description: "Strong CTA button text",
                },
              },
              required: [
                "headline",
                "subheadline",
                "value_proposition",
                "key_features",
                "call_to_action",
              ],
            },
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = JSON.parse(data.choices[0].message.content);
        setResult(parsed);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-blue-500 p-8 rounded-2xl w-full max-w-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-4 text-black">
          AI Landing Page Copy Generator
        </h1>

        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter product or service name..."
          className="w-full p-4 border rounded-xl mb-4 text-gray-800 font-bold"
        />

        <button
          onClick={generateCopy}
          className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold"
        >
          Generate Landing Page Copy
        </button>

        {isLoading && (
          <p className="text-center mt-4 text-black animate-pulse">
            Writing high-converting copy...
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-4 bg-white p-6 rounded-xl text-gray-700">
            <div>
              <h3 className="font-semibold text-indigo-600">Headline</h3>
              <p className="font-bold text-lg">{result.headline}</p>
            </div>

            <div>
              <h3 className="font-semibold text-red-600">Subheadline</h3>
              <p>{result.subheadline}</p>
            </div>

            <div>
              <h3 className="font-semibold text-green-600">
                Value Proposition
              </h3>
              <p>{result.value_proposition}</p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-600">Key Features</h3>
              <p>{result.key_features}</p>
            </div>

            <div>
              <h3 className="font-semibold text-yellow-600">Call To Action</h3>
              <p className="font-bold">{result.call_to_action}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
