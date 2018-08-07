#!/bin/bash
FUNCTION_NAME=$1

if [ "$FUNCTION_NAME" == "" ]; then
    echo "Usage: $0 <name of your Google Cloud Function>"
    exit 1
fi

if [ ! -e mail.settings ]; then
    echo "Create a mail.settings file, based on mail.settings.example, containing your Mailgun SMTP"
    echo "credentials, the email addresses to/from which you want to send notifications, and your"
    echo "Mailgun API key (Find this info on the Mailgun dashboard.)"
    exit 1
fi

gcloud beta functions deploy "$FUNCTION_NAME" --trigger-http --runtime nodejs6 --memory 128MB --entry-point cloudFunction --source .
