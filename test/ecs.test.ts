import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert'
import { createStack } from './helpers'

test('ECS Cluster and Fargate task definition are created', () => {
  const stack = createStack()

  expectCDK(stack).to(haveResourceLike('AWS::ECS::Cluster'))

  expectCDK(stack).to(
    haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: 'AWS_REGION',
              Value: {},
            },
            {
              Name: 'INPUT_VIDEO_FILE_URL',
              Value: '',
            },
            {
              Name: 'POSITION_TIME_DURATION',
              Value: '00:01',
            },
            {
              Name: 'OUTPUT_THUMBS_FILE_NAME',
              Value: '',
            },
            {
              Name: 'OUTPUT_S3_PATH',
              Value: '',
            },
          ],
          Essential: true,
          Image: 'ryands1701/thumbnail-creator:1.0.0',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {},
          },
          Name: 'ffmpeg',
        },
      ],
      Cpu: '256',
      ExecutionRoleArn: {},
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: ['FARGATE'],
      TaskRoleArn: {},
    })
  )
})
