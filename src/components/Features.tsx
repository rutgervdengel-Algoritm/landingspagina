'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bell,
  BarChart3,
  Users,
  Lock,
  Repeat,
  Eye,
  Mail,
  Smartphone,
  Heart,
  Calendar,
  Star,
} from 'lucide-react';

const tabs = [
  { id: 'opvang', label: 'Voor opvang' },
  { id: 'ouders', label: 'Voor ouders' },
];

const features = {
  opvang: [
    {
      icon: LayoutDashboard,
      title: 'Centraal dashboard',
      description: 'Beheer alle wachtlijsten vanuit één overzichtelijk dashboard.',
    },
    {
      icon: Repeat,
      title: 'Automatische matching',
      description: 'Match kinderen automatisch op basis van leeftijd, voorkeuren en beschikbaarheid.',
    },
    {
      icon: Mail,
      title: 'Geautomatiseerde e-mails',
      description: 'Stuur automatische updates wanneer posities veranderen of plekken vrijkomen.',
    },
    {
      icon: BarChart3,
      title: 'Rapportages & inzichten',
      description: 'Bekijk trends, doorlooptijden en conversiepercentages in real-time.',
    },
    {
      icon: Lock,
      title: 'Audit trail',
      description: 'Volledige logging van alle acties en communicatie. AVG-compliant.',
    },
    {
      icon: Users,
      title: 'Multi-locatie beheer',
      description: 'Beheer wachtlijsten voor meerdere locaties vanuit één account.',
    },
  ],
  ouders: [
    {
      icon: Eye,
      title: 'Real-time positie',
      description: 'Zie direct waar je kind staat op de wachtlijst. Altijd actueel.',
    },
    {
      icon: Bell,
      title: 'Slimme notificaties',
      description: 'Ontvang een bericht als je positie verandert of er een plek vrijkomt.',
    },
    {
      icon: Smartphone,
      title: 'Mobiel-vriendelijk',
      description: 'Check je wachtlijstpositie waar en wanneer je wilt, op elk apparaat.',
    },
    {
      icon: Heart,
      title: 'Voorkeuren instellen',
      description: 'Geef je voorkeuren op voor dagen, tijden en locaties.',
    },
    {
      icon: Calendar,
      title: 'Verwachte plaatsingsdatum',
      description: 'Krijg een indicatie wanneer je kind geplaatst kan worden.',
    },
    {
      icon: Star,
      title: 'Meerdere wachtlijsten',
      description: 'Schrijf je in bij meerdere locaties en beheer alles op één plek.',
    },
  ],
};

export default function Features() {
  const [activeTab, setActiveTab] = useState<'opvang' | 'ouders'>('opvang');

  return (
    <section id="features" className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Alles wat je nodig hebt</h2>
          <p className="section-subtitle">
            Krachtige features voor kinderopvangorganisaties en ouders.
          </p>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex bg-cream-300 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'opvang' | 'ouders')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-forest-600 shadow-sm'
                    : 'text-navy-500 hover:text-forest-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features[activeTab].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card"
              >
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-teal-600" />
                </div>
                <h3 className="font-semibold text-forest-600 mb-1">{feature.title}</h3>
                <p className="text-sm text-navy-500">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
