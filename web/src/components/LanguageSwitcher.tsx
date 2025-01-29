import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export const LanguageSwitcher = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const changeLanguage = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value;
    const { pathname, asPath, query } = router;
    try {
      await router.push({ pathname, query }, asPath, { locale });
    } catch (error) {
      console.error(t('errors.failed_language_change'), error);
    }
  };

  return (
    <div className="relative inline-block">
      <select
        onChange={changeLanguage}
        value={router.locale}
        className="appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}; 