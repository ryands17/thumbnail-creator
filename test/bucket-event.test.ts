import {
  expect as expectCDK,
  haveResourceLike,
  ResourcePart,
} from '@aws-cdk/assert'
import { createStack } from './helpers'

test('S3 bucket is created', () => {
  const stack = createStack()

  expectCDK(stack).to(
    haveResourceLike(
      'AWS::S3::Bucket',
      {
        Type: 'AWS::S3::Bucket',
        UpdateReplacePolicy: 'Delete',
        DeletionPolicy: 'Delete',
      },
      ResourcePart.CompleteDefinition
    )
  )
})

test('Lambda and the corresponding S3 event are created', () => {
  const stack = createStack()

  expectCDK(stack).to(
    haveResourceLike('AWS::Lambda::Function', {
      Code: {},
      Role: {},
      Runtime: 'nodejs12.x',
    })
  )

  expectCDK(stack).to(
    haveResourceLike('Custom::S3BucketNotifications', {
      ServiceToken: {},
      BucketName: {},
      NotificationConfiguration: {
        LambdaFunctionConfigurations: [
          {
            Events: ['s3:ObjectCreated:*'],
            Filter: {
              Key: {
                FilterRules: [
                  {
                    Name: 'suffix',
                    Value: '.mp4',
                  },
                  {
                    Name: 'prefix',
                    Value: 'videos/',
                  },
                ],
              },
            },
            LambdaFunctionArn: {},
          },
        ],
      },
    })
  )
})
