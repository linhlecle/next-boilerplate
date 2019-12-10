import App from 'next/app';
import { getCookies } from 'cookies-next';

import { IntlProvider, LOCALE_COOKIE_KEY } from 'components/IntlProvider';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const { req } = ctx;
    const msgs = req || window.__NEXT_DATA__.props;
    const messages = msgs.messages;

    return {
      pageProps,
      messages,
      locale: getCookies(ctx, LOCALE_COOKIE_KEY),
    };
  }

  render() {
    const { Component, pageProps, locale, messages } = this.props;
    return (
      <IntlProvider fullMessages={messages} locale={locale}>
        <Component {...pageProps} />
      </IntlProvider>
    );
  }
}

export default MyApp;
