'use client';

import React, { useState } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Mail, Send, User, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
    alert('¡Mensaje enviado! (Demo)');
  };

  return (
    <SectionWrapper id="contact" className="bg-surface/30">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Contacto"
          subtitle="¿Tienes un proyecto en mente? Hablemos"
        />

        <div className="max-w-2xl mx-auto mt-12">
          <GlassPanel className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-1">
                  Mensaje
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-4 text-white/40 w-5 h-5" />
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Cuéntame sobre tu proyecto..."
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" icon={Send} iconPosition="right" loading={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </form>
          </GlassPanel>
        </div>
      </div>
    </SectionWrapper>
  );
};