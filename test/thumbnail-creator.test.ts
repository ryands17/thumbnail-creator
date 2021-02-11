import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as ThumbnailCreator from '../lib/thumbnail-creator-stack'

test.skip('Empty Stack', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new ThumbnailCreator.ThumbnailCreatorStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  )
})
