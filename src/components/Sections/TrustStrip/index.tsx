'use client';

import { BadgeCheck, Layers, Share2, Workflow, Rocket, Server, Sparkles } from 'lucide-react';
import { useDictionary } from '@/context/DictionaryContext';

const trustItems = [
  { key: '1', Icon: BadgeCheck },
  { key: '2', Icon: Layers },
  { key: '3', Icon: Share2 },
  { key: '4', Icon: Workflow },
  { key: '5', Icon: Rocket },
  { key: '6', Icon: Server },
  { key: '7', Icon: Sparkles },
] as const;

export function TrustStrip() {
  const { dictionary } = useDictionary();
  const d = dictionary.trust;

  return (
    <section className="border-y border-ink-800 bg-ink-900" aria-label="Core capabilities">
      <div className="d9-container-wide py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {trustItems.map(({ key, Icon }, idx) => (
            <span key={key} className="flex items-center gap-2">
              {idx > 0 && (
                <span className="hidden sm:inline-block w-px h-4 bg-ink-700 -ml-4 mr-0" aria-hidden="true" />
              )}
              <span className="flex items-center gap-2 text-ink-400 text-sm font-medium">
                <Icon size={16} className="text-ink-500 flex-shrink-0" />
                {d[key]}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
