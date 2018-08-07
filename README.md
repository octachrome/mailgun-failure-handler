Mailgun failure handler with GCF
================================

A Google cloud function which sends you an email when a Mailgun event occurs (e.g., a delivery failure), based on https://www.mailgun.com/blog/a-guide-to-using-mailguns-webhooks.

Prerequesites:

- A Mailgun account and domain
- A Google Cloud Platform account and project
- `gcloud` installed on your PC, logged in, and the correct project activated

To use it:

- Create a `mail.settings` file, based on `mail.settings.example`, containing your SMTP credentials, the email addresses to/from which you want to send notifications, and your Mailgun API key. (Find this info on the Mailgun dashboard.)
- Run `./deploy.sh mailgun-failure-handler` to deploy the cloud function. You can choose a different name for your function if you like.
