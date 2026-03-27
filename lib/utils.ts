import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COR_CHAKRA: Record<string, string> = {
  Vermelho:  'bg-red-500',
  Laranja:   'bg-orange-500',
  Amarelo:   'bg-yellow-400',
  Verde:     'bg-green-500',
  Azul:      'bg-blue-500',
  Índigo:    'bg-indigo-600',
  Violeta:   'bg-violet-600',
};
