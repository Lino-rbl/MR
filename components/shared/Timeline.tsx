'use client';

import React from 'react';
import { Reveal } from '@/components/animations/Reveal';

interface TimelineItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
  technologies: string[];
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative border-l-2 border-primary/30 pl-8 space-y-12">
      {items.map((item, index) => (
        <Reveal key={item.id} delay={index * 0.1}>
          <div className="relative">
            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{item.position}</h3>
                <p className="text-primary font-medium">{item.company}</p>
                <p className="text-white/40 text-sm">
                  {item.startDate} — {item.endDate}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-white/70 list-disc list-inside">
              {item.description.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
};