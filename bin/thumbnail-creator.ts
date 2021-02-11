#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { ThumbnailCreatorStack } from '../lib/thumbnail-creator-stack'

const app = new cdk.App()
new ThumbnailCreatorStack(app, 'ThumbnailCreatorStack', {
  env: { region: app.node.tryGetContext('region') },
})
