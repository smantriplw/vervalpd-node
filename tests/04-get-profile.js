/* eslint-disable n/prefer-global/process */
import {VervalPd} from '../dist/index.js';
import {CookieFileConsumer} from '../dist/cookie-file-consumer.js';

const verval = new VervalPd({
  email: process.env.EMAIL,
  password: process.env.PWD,
}, {
  cookieInstance: new CookieFileConsumer('/tmp/cookies__verval.json'),
});

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  const students = await verval.getProfile('2C4B19C3-70C6-45CE-A64D-00E7DFB0AC86');
  console.log(students);
})();
