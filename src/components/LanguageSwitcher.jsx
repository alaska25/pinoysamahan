import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('snp_lang', lng);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => changeLang('en')}
        style={{ fontWeight: i18n.language === 'en' ? 700 : 400, background: 'none', border: 'none', cursor: 'pointer' }}
      >
        EN
      </button>
      <span>|</span>
      <button
        onClick={() => changeLang('tl')}
        style={{ fontWeight: i18n.language === 'tl' ? 700 : 400, background: 'none', border: 'none', cursor: 'pointer' }}
      >
        TL
      </button>
    </div>
  );
}