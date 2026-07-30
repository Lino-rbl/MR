export interface MetaData {
  title: string;
  description: string;
  image?: string;
}

export type Theme = 'light' | 'dark';

export interface SectionProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}