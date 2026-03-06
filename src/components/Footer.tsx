'use client';

import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Prijzen', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Roadmap', href: '#' },
  ],
  'Voor wie': [
    { label: 'Kinderopvang', href: '#opvang' },
    { label: 'Ouders', href: '#ouders' },
    { label: 'BSO', href: '#opvang' },
    { label: 'Gastouders', href: '#opvang' },
  ],
  Juridisch: [
    { label: 'Privacy', href: '#' },
    { label: 'Algemene voorwaarden', href: '#' },
    { label: 'Cookie beleid', href: '#' },
    { label: 'AVG', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-cream-100 border-t border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-forest-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-serif text-xl text-forest-600">
                WachtlijstHelderheid
              </span>
            </div>
            <p className="text-navy-500 text-sm max-w-sm mb-6">
              Transparant wachtlijstbeheer voor kinderopvangorganisaties. Geef ouders
              helderheid en bespaar kostbare tijd.
            </p>
            <div className="space-y-2">
              <a href="mailto:info@wachtlijsthelderheid.nl" className="flex items-center gap-2 text-sm text-navy-500 hover:text-forest-500 transition-colors">
                <Mail size={16} />
                info@wachtlijsthelderheid.nl
              </a>
              <a href="tel:+31201234567" className="flex items-center gap-2 text-sm text-navy-500 hover:text-forest-500 transition-colors">
                <Phone size={16} />
                +31 (0)20 123 4567
              </a>
              <div className="flex items-center gap-2 text-sm text-navy-500">
                <MapPin size={16} />
                Amsterdam, Nederland
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-forest-600 text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-navy-500 hover:text-forest-500 transition-colors underline-offset-2 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <a href="#pricing" className="btn-primary text-sm !py-2 !px-5">
              Vrijblijvend inschrijven
            </a>
            <a href="#opvang" className="btn-outline text-sm !py-2 !px-5">
              Rondleiding aanvragen
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-cream-300 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-navy-400">
            &copy; {new Date().getFullYear()} WachtlijstHelderheid. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-navy-400 hover:text-forest-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-navy-400 hover:text-forest-500 transition-colors">
              Voorwaarden
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
