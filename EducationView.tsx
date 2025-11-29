import React from 'react';
import { Bot, User } from './Icons';

const WRITING_TIPS = [
  {
    title: "Vary Sentence Length",
    description: "AI often generates sentences of uniform length. Humans mix short, punchy sentences with longer, meandering ones.",
    example_ai: "The quick brown fox jumps over the lazy dog. It was a sunny day in the forest. The dog was sleeping soundly.",
    example_human: "The quick brown fox jumped. Right over the lazy dog, who was fast asleep on this unusually sunny day."
  },
  {
    title: "Use Active Voice",
    description: "AI tends towards passive voice to sound objective. Active voice is more engaging and human.",
    example_ai: "The decision was made by the committee to approve the new policy.",
    example_human: "The committee decided to approve the new policy."
  },
  {
    title: "Add Personal Nuance",
    description: "AI lacks real-world experience. Adding personal anecdotes or specific, gritty details adds authenticity.",
    example_ai: "Cooking pasta is easy. You boil water and add the pasta.",
    example_human: "I'll never forget the first time I burnt pasta water—yes, it's possible. But generally, boiling it is the easy part."
  },
  {
    title: "Embrace Imperfection",
    description: "Perfect grammar isn't always 'human'. Conversational contractions (can't, won't) and idioms make text flow better.",
    example_ai: "It is important to not forget your umbrella.",
    example_human: "Don't forget your umbrella."
  }
];

export const EducationView: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-4">How to Write Like a Human</h2>
        <p className="text-brand-muted">Beat the AI detectors by mastering the nuances of natural language.</p>
      </div>

      <div className="grid gap-6">
        {WRITING_TIPS.map((tip, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-brand-crimson/30 transition-colors">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <span className="bg-brand-crimson/20 text-brand-crimson w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                  {idx + 1}
                </span>
                {tip.title}
              </h3>
              <p className="text-gray-300 mb-6 ml-11">{tip.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 ml-11">
                <div className="bg-black/40 rounded-lg p-4 border border-red-900/30">
                  <div className="flex items-center gap-2 text-xs uppercase text-red-400 font-bold mb-2">
                    <Bot className="w-3 h-3" /> AI Pattern
                  </div>
                  <p className="text-sm text-gray-400 italic">"{tip.example_ai}"</p>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-green-900/30">
                  <div className="flex items-center gap-2 text-xs uppercase text-green-400 font-bold mb-2">
                     <User className="w-3 h-3" /> Human Touch
                  </div>
                  <p className="text-sm text-gray-300">"{tip.example_human}"</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
