import { BASE_BOILERPLATES } from '../constants';
import type { Language } from '../types';

export function getBoilerplate(language: Language) {
  return BASE_BOILERPLATES[language].code;
}

export function getLanguageLabel(language: Language) {
  return BASE_BOILERPLATES[language].label;
}
