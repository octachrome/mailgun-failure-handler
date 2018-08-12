const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

function createWebhook(handler) {
    return (request, response) => {
        try {
            handler(request.body, err => {
                if (err) {
                    console.error('Error handling request', err);
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end(err.message);
                }
                else {
                    response.end();
                }
            });
        }
        catch (err) {
            console.error('Error handling request', err);
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end('Error handling request\n');
        }
    };
}

function createMailer(settings) {
    const transporter = nodemailer.createTransport(settings.smtp);
    return (body, subject, callback) => {
        try {
            const mail = Object.assign({}, settings.mail, {subject});
            mail.text = JSON.stringify(body, null, 2) + '\n';
            transporter.sendMail(mail, callback);
        }
        catch (err) {
            callback(err);
        }
    }
}

function verifySignature(data, apiKey, callback) {
    const hash = crypto.createHmac('sha256', apiKey)
        .update(new Buffer(data.timestamp + data.token, 'utf-8'))
        .digest('hex');
    if (hash !== data.signature) {
        callback(new Error('Invalid signature'));
    }
    else {
        callback();
    }
}

let webhook;

function cloudFunction(req, res) {
    try {
        if (!webhook) {
            const settings = JSON.parse(fs.readFileSync('mail.settings'));
            const mailer = createMailer(settings);
            webhook = createWebhook((data, callback) => {
                verifySignature(data.signature, settings.apiKey, err => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        const eventData = data['event-data'];
                        let subject;
                        if (eventData.message && eventData.message.headers) {
                            subject = eventData.message.headers.subject;
                        }
                        mailer(eventData, subject || 'Mailgun Event', callback);
                    }
                });
            });
        }
        webhook(req, res);
    }
    catch (err) {
        console.error('Error handling request', err);
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.end('Error handling request\n');
    }
}

module.exports = {createMailer, cloudFunction};
