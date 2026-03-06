'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Linda van Dijk',
    role: 'Manager, KDV De Regenboog',
    text: 'We besparen minstens 10 uur per week sinds we WachtlijstHelderheid gebruiken. Ouders zijn veel tevredener en we krijgen nauwelijks nog telefoontjes over wachtlijstposities.',
    rating: 5,
  },
  {
    name: 'Pieter Hendricks',
    role: 'Directeur, BSO Avontuur',
    text: 'De automatische matching is fantastisch. Wat voorheen een hele dag kostte, doet het systeem nu in minuten. En ouders krijgen direct bericht.',
    rating: 5,
  },
  {
    name: 'Sarah Willems',
    role: 'Ouder',
    text: 'Eindelijk weet ik waar mijn dochter staat op de wachtlijst. Ik krijg automatisch updates en hoef niet meer te bellen. Dat scheelt zoveel stress!',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-cream-100 relative overflow-hidden">
      {/* Decorative teal curved lines like CompaNanny */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 500"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-50,250 C150,50 350,400 600,200 C850,0 1100,350 1500,150"
          stroke="#5BA89D"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        <circle cx="200" cy="300" r="80" stroke="#5BA89D" strokeWidth="2" fill="none" opacity="0.2" />
        <circle cx="1300" cy="150" r="60" stroke="#5BA89D" strokeWidth="2" fill="none" opacity="0.15" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Ouders over WachtlijstHelderheid</h2>
          <p className="section-subtitle">
            Ontdek waarom 100+ kinderopvangorganisaties en duizenden ouders kiezen voor
            WachtlijstHelderheid.
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-cream-300 rounded-2xl p-6 relative"
            >
              <Quote size={32} className="text-teal-300 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-terracotta-400 fill-terracotta-400" />
                ))}
              </div>
              <p className="text-forest-600 text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                  <span className="text-forest-600 font-semibold text-sm">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-forest-600 text-sm">{t.name}</p>
                  <p className="text-xs text-navy-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
