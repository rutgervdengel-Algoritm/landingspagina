'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, PhoneOff, FileQuestion, Clock } from 'lucide-react';

const problems = [
  {
    icon: FileQuestion,
    title: 'Geen inzicht',
    description:
      'Ouders weten niet waar ze staan op de wachtlijst. Ze bellen en mailen continu voor updates.',
  },
  {
    icon: Clock,
    title: 'Tijdrovend handwerk',
    description:
      'Administratie kost gemiddeld 12 uur per week. Excel-lijsten, handmatige e-mails en telefoontjes.',
  },
  {
    icon: PhoneOff,
    title: 'Slechte communicatie',
    description:
      'Ouders voelen zich genegeerd. Geen automatische updates wanneer hun positie verandert.',
  },
  {
    icon: AlertTriangle,
    title: 'Geen audit trail',
    description:
      'Bij klachten of geschillen ontbreekt een duidelijk overzicht van wie wanneer is geïnformeerd.',
  },
];

export default function Problem() {
  return (
    <section id="opvang" className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge-amber mx-auto w-fit mb-4">
            <AlertTriangle size={16} className="mr-1" />
            Herkenbaar?
          </div>
          <h2 className="section-title">
            Wachtlijstbeheer is een <span className="text-terracotta-500">chaos</span>
          </h2>
          <p className="section-subtitle">
            Kinderopvangorganisaties worstelen dagelijks met ongestructureerd wachtlijstbeheer.
            Dit kost tijd, geld en vertrouwen.
          </p>
        </motion.div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-terracotta-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <problem.icon size={24} className="text-terracotta-500" />
              </div>
              <h3 className="font-semibold text-forest-600 mb-2">{problem.title}</h3>
              <p className="text-sm text-navy-500">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
