import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { setCookies } from 'cookies-next';
import { IntlContext } from './IntlContext';
import { LOCALE_COOKIE_KEY, DEFAULT_LOCALE } from './constants';

export const IntlProviderWrapper = ({ children, fullMessages, locale }) => {
  const [state, setState] = useState({
    changeLang,
    locale: DEFAULT_LOCALE,
    messages: fullMessages[locale || DEFAULT_LOCALE],
  });

  function changeLang(locale) {
    setState({ ...state, locale, messages: fullMessages[locale] });
    setCookies(null, LOCALE_COOKIE_KEY, locale);
  }

  return (
    <IntlContext.Provider value={state}>
      <IntlProvider
        key={state.locale}
        locale={state.locale}
        messages={state.messages}
        defaultLocale={DEFAULT_LOCALE}
      >
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  );
};
