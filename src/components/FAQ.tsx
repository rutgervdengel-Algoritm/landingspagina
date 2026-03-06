'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Hoe werkt WachtlijstHelderheid voor ouders?',
    answer:
      'Als ouder maak je gratis een account aan en kun je direct je wachtlijstpositie inzien bij deelnemende kinderopvangorganisaties. Je ontvangt automatisch updates via e-mail wanneer je positie verandert.',
  },
  {
    question: 'Wat kost het voor kinderopvangorganisaties?',
    answer:
      'We bieden twee betaalde plannen: Basis (€79/maand) voor kleinere organisaties en Pro (€149/maand) voor grotere organisaties. Beide plannen hebben een gratis proefperiode van 14 dagen.',
  },
  {
    question: 'Is mijn data veilig?',
    answer:
      'Absoluut. We zijn volledig AVG-compliant en alle data wordt versleuteld opgeslagen in Europese datacenters. We delen nooit persoonlijke gegevens met derden.',
  },
  {
    question: 'Hoe lang duurt het om te starten?',
    answer:
      'Je kunt binnen 15 minuten live zijn. We helpen je met het importeren van je bestaande wachtlijsten en het instellen van je account. Onze onboarding is volledig begeleid.',
  },
  {
    question: 'Kan ik het systeem koppelen aan mijn bestaande software?',
    answer:
      'Ja, met het Pro-plan heb je toegang tot onze API. We ondersteunen koppelingen met veelgebruikte kinderopvangsoftware en bieden een REST API voor maatwerk integraties.',
  },
  {
    question: 'Wat als ik niet tevreden ben?',
    answer:
      'We bieden een 14 dagen gratis proefperiode zonder verplichtingen. Geen creditcard nodig. Je kunt op elk moment opzeggen, er zijn geen langlopende contracten.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Veelgestelde vragen</h2>
          <p className="section-subtitle">
            Heb je een andere vraag? Neem gerust contact met ons op.
          </p>
        </motion.div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border border-navy-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-navy-50 transition-colors"
              >
                <span className="font-medium text-navy-900 pr-4">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-navy-400 flex-shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-navy-600 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
