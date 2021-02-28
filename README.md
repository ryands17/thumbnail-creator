# Video Thumbnail Creator

[![Build Status](https://github.com/ryands17/thumbnail-creator/actions/workflows/main.yml/badge.svg)](https://github.com/ryands17/thumbnail-creator/actions/workflows/main.yml)

A CDK project to create a thumbnail using Fargate from a video uploaded to S3. A Lambda function is configured for S3 events which in turn triggers the Lambda function.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

Edit the `cdk.context.json` to specify the region you would want to deploy to.

## Useful commands

- `yarn build` compile typescript to js
- `yarn watch` watch for changes and compile
- `yarn test` perform the jest unit tests
- `yarn cdk deploy` deploy this stack to your default AWS account/region
- `yarn cdk diff` compare deployed stack with current state
- `yarn cdk synth` emits the synthesized CloudFormation template
