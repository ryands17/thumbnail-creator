import * as cdk from '@aws-cdk/core'
import * as ThumbnailCreator from '../lib/thumbnail-creator-stack'

export const createStack = () => {
  const app = new cdk.App()
  return new ThumbnailCreator.ThumbnailCreatorStack(app, 'ThumbnailCreator')
}
