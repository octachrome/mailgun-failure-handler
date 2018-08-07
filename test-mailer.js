const settings = JSON.parse(require('fs').readFileSync('mail.settings'));
const {createMailer} = require('./index');
const mailer = createMailer(settings);
mailer({test: true}, err => err && console.log(err));
