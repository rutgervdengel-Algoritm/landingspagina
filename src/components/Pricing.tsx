'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'Ouder',
    price: '0',
    period: 'altijd gratis',
    description: 'Voor ouders die inzicht willen in hun wachtlijstpositie.',
    features: [
      'Real-time wachtlijstpositie',
      'E-mail notificaties',
      'Meerdere wachtlijsten',
      'Mobiel-vriendelijk portaal',
    ],
    cta: 'Gratis aanmelden',
    highlighted: false,
    color: 'navy',
  },
  {
    name: 'Basis',
    price: '79',
    period: 'per maand',
    description: 'Voor kleinere organisaties met 1-3 locaties.',
    features: [
      'Alles van Ouder',
      'Tot 3 locaties',
      'Centraal dashboard',
      'Geautomatiseerde e-mails',
      'Basis rapportages',
      'E-mail support',
    ],
    cta: 'Start gratis proefperiode',
    highlighted: true,
    color: 'primary',
  },
  {
    name: 'Pro',
    price: '149',
    period: 'per maand',
    description: 'Voor grotere organisaties met uitgebreide behoeften.',
    features: [
      'Alles van Basis',
      'Onbeperkt locaties',
      'Automatische matching',
      'Geavanceerde rapportages',
      'Audit trail',
      'API-toegang',
      'Prioriteit support',
    ],
    cta: 'Start gratis proefperiode',
    highlighted: false,
    color: 'navy',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Eenvoudige, transparante prijzen</h2>
          <p className="section-subtitle">
            Geen verborgen kosten. Start gratis en upgrade wanneer je wilt.
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-white border-2 border-primary-600 shadow-xl relative'
                  : 'bg-white border border-navy-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="badge bg-secondary-100 text-secondary-700">
                    <Star size={14} className="mr-1 fill-secondary-500" />
                    Meest gekozen
                  </div>
                </div>
              )}

              <h3 className="text-xl font-bold text-navy-900">{plan.name}</h3>
              <p className="text-sm text-navy-500 mt-1">{plan.description}</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-navy-900">
                  &euro;{plan.price}
                </span>
                <span className="text-navy-400 ml-2">/ {plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-navy-600">
                    <Check size={18} className="text-success flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
