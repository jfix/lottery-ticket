Lottery ticket
==============

This is an AWS Lambda function that gets executed every Sunday at 10am. It will determine a "winning number" based on the total number of coffees consumed + a random number between 0 and last week's consumption.

Yes, under certain circumstances this could mean that nobody wins the lottery. "That's life."

The script will add new documents to the database, more specifically the `lottery-ticket` collection. I was thinking of replacing an existing one because accessing the number would be very easy. But then I thought 'audit trail'! And that means to keep all documents, and the current one would be the last. Not much more complicated.

Deploying is done via `serverless deploy`. This will deploy not just the actual function but also the entire service via CloudFormation (think roles, event triggers, logging, etc.).

`sls deploy function -f planner` will only redeploy the actual code, not the rest of the service.

`sls invoke local -f planner` will invoke the local copy of the function. It will _not_ call the function that has been deployed on AWS. So it's a good way to test before deploying, especially when the function and its dependencies are on the larger side.

`sls invoke -f planner` will invoke the 'remote' function, i.e. the one you've deployed to AWS.

In this case, the function will be invoked like a cron job, i.e. every Sunday at 10am. This is specified in the `serverless.yml` file. The corresponding section looks like this:

```
events:
  # http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
  - schedule:
      enabled: false
      rate: cron(0 10 ? * SUN *) # run at 10am each Sunday
```
