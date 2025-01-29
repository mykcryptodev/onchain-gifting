// @ts-check

/**
 * @type {import('next-i18next').UserConfig}
 */
const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh']
  },
  defaultNS: 'common',
  localePath: './public/locales'
}

export default config 