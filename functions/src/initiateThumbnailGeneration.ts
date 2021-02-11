import { S3Event } from 'aws-lambda'

export const handler = async (event: S3Event) => {
  console.log(JSON.stringify(event.Records[0], null, 2))
}
