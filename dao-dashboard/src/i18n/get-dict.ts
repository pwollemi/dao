// import 'server-only'
import { Locale } from './types'

const dictionaries = {
  en: () => import('./dict/en.json').then((module) => module.default),
  ja: () => import('./dict/ja.json').then((module) => module.default),
  cn: () => import('./dict/cn.json').then((module) => module.default),
  es: () => import('./dict/es.json').then((module) => module.default),
  fr: () => import('./dict/fr.json').then((module) => module.default),
  pt: () => import('./dict/pt.json').then((module) => module.default),
}

export const getDict = (locale: Locale) => dictionaries[locale]()
