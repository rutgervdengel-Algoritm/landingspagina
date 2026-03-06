'use client';

import { motion } from 'framer-motion';
import { Zap, BarChart3, Mail, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: BarChart3,
    title: 'Centraal dashboard',
    description: 'Alle wachtlijsten op één plek. Overzichtelijk, real-time en altijd up-to-date.',
  },
  {
    icon: Zap,
    title: 'Automatische matching',
    description:
      'Het systeem matcht kinderen automatisch aan beschikbare plekken op basis van voorkeuren en criteria.',
  },
  {
    icon: Mail,
    title: 'Geautomatiseerde communicatie',
    description:
      'Ouders ontvangen automatisch updates over hun positie. Geen handmatige e-mails meer.',
  },
  {
    icon: ShieldCheck,
    title: 'Volledige audit trail',
    description:
      'Elk contact, elke wijziging wordt vastgelegd. Transparant en compliant.',
  },
];

export default function Solution() {
  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge-green mx-auto w-fit mb-4">
            <Zap size={16} className="mr-1" />
            De oplossing
          </div>
          <h2 className="section-title">
            Hoe <span className="text-teal-600">WachtlijstHelderheid</span> het oplost
          </h2>
          <p className="section-subtitle">
            Eén platform dat wachtlijstbeheer automatiseert en ouders het vertrouwen geeft
            dat ze verdienen.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 card"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <step.icon size={24} className="text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-forest-600 mb-1">{step.title}</h3>
                <p className="text-sm text-navy-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
