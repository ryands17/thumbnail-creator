import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecs from '@aws-cdk/aws-ecs'
import * as iam from '@aws-cdk/aws-iam'
import * as s3Notif from '@aws-cdk/aws-s3-notifications'
import { RetentionDays } from '@aws-cdk/aws-logs'
import { createLambdaFn } from './helpers'

const bucketName = 'multimedia-app-store'
const prefix = 'videos/'

export class ThumbnailCreatorStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // VPC for ECS (Fargate) and the Lambda
    const vpc = new ec2.Vpc(this, 'serverless-app', {
      cidr: '10.0.0.0/21',
      natGateways: 0,
      maxAzs: 2,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          cidrMask: 23,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 23,
          name: 'private',
          subnetType: ec2.SubnetType.ISOLATED,
        },
      ],
    })

    // The ECS Cluster for Fargate tasks
    const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc })

    // S3 bucket that holds videos and their respective thumbnails
    const imagesBucket = new s3.Bucket(this, bucketName, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // Task definition for the Fargate task to generate a thumbnail
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'GenerateThumbnail',
      { memoryLimitMiB: 512, cpu: 256 }
    )
    imagesBucket.grantWrite(taskDefinition.taskRole)

    taskDefinition.addContainer('ffmpeg', {
      image: ecs.ContainerImage.fromRegistry('ryands1701/thumbnail-creator'),
      logging: new ecs.AwsLogDriver({
        streamPrefix: 'FargateGenerateThumbnail',
        logRetention: RetentionDays.ONE_WEEK,
      }),
      environment: {
        AWS_REGION: this.region,
        INPUT_VIDEO_FILE_URL: '',
        POSITION_TIME_DURATION: '00:01',
        OUTPUT_THUMBS_FILE_NAME: '',
        OUTPUT_S3_PATH: '',
      },
    })

    // Lambda function executed on video upload
    const initiateThumbnailGeneration = createLambdaFn(
      this,
      'initiateThumbnailGeneration',
      {
        reservedConcurrentExecutions: 10,
        environment: {
          ECS_CLUSTER_NAME: cluster.clusterName,
          ECS_TASK_DEFINITION: taskDefinition.taskDefinitionArn,
          VPC_SUBNETS: vpc.publicSubnets.map(s => s.subnetId).join(','),
        },
      }
    )

    initiateThumbnailGeneration.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ecs:RunTask'],
        resources: [taskDefinition.taskDefinitionArn],
      })
    )

    // Fire the lambda on a video(.mp4) uploaded to the `videos` folder/prefix
    imagesBucket.addObjectCreatedNotification(
      new s3Notif.LambdaDestination(initiateThumbnailGeneration),
      { prefix, suffix: '.mp4' }
    )
  }
}
