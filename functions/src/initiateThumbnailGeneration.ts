import { S3Event } from 'aws-lambda'
import { ECS } from 'aws-sdk'
import { envs } from './config'

const ecs = new ECS()

export const handler = async (event: S3Event) => {
  console.log(JSON.stringify(event.Records[0], null, 2))
  const { bucket, object } = event.Records[0].s3

  let videoURL = `https://s3.amazonaws.com/${bucket.name}/${object.key}`
  let thumbnailName = `${object.key}.png`
  let framePosition = '01:32'

  await generateThumbnail({
    videoURL,
    thumbnailName,
    framePosition,
    bucketName: bucket.name,
  })
}

const generateThumbnail = async ({
  videoURL,
  thumbnailName,
  framePosition = '00:01',
  bucketName,
}: GenerateThumbnail) => {
  let params: ECS.RunTaskRequest = {
    taskDefinition: envs.ECS_TASK_DEFINITION,
    cluster: envs.ECS_CLUSTER_NAME,
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: 'ENABLED',
        subnets: envs.VPC_SUBNETS,
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: 'ffmpeg',
          environment: [
            { name: 'AWS_REGION', value: envs.AWS_REGION },
            { name: 'INPUT_VIDEO_FILE_URL', value: videoURL },
            { name: 'OUTPUT_THUMBS_FILE_NAME', value: thumbnailName },
            { name: 'POSITION_TIME_DURATION', value: framePosition },
            { name: 'OUTPUT_S3_PATH', value: `${bucketName}/thumbnails` },
          ],
        },
      ],
    },
  }
  try {
    let data = await ecs.runTask(params).promise()
    console.log(
      `ECS Task ${params.taskDefinition} started: ${JSON.stringify(
        data.tasks,
        null,
        2
      )}`
    )
  } catch (error) {
    console.log(`Error processing ECS Task ${params.taskDefinition}: ${error}`)
  }
}

type GenerateThumbnail = {
  videoURL: string
  thumbnailName: string
  framePosition: string
  bucketName: string
}
