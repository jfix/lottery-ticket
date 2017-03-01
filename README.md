Lottery ticket
==============

This is (or will become) an AWS Lambda function that gets executed every Sunday. It will determine a "winning number" based on the total number of coffees consumed + a random number between 0 and last week's consumption.

Yes, under certain circumstances this could mean that nobody wins the lottery. That's life.

The script will add new documents to the database, more specifically the `lottery-ticket` collection. I was thinking of replacing an existing one because accessing the number would be very easy. But then I thought 'audit trail'! And that means to keep all documents, and the current one would be the last. Not much more complicated.

Deploying is (or will be) done via `serverless deploy`.
