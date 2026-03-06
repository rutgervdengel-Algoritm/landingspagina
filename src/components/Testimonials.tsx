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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Wat anderen zeggen</h2>
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
              className="card relative"
            >
              <Quote size={32} className="text-primary-100 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-warning fill-warning" />
                ))}
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{t.name}</p>
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
