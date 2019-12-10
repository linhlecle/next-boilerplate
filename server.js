const express = require('express');
const next = require('next');
const compression = require('compression');
const glob = require('glob');
const { basename } = require('path');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const getMessages = locale => {
  return require(`./lang/${locale}.json`);
};

app
  .prepare()
  .then(() => {
    const server = express();
    const messages = glob
      .sync('./lang/*.json')
      .map(f => basename(f, '.json'))
      .reduce(
        (messages, locale) => ({
          ...messages,
          [locale]: getMessages(locale),
        }),
        {},
      );

    if (!dev) server.use(compression({ level: 9 }));

    server.use((req, res, next) => {
      req.messages = messages;
      next();
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log('-------------', err);
  });
