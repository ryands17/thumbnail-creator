import { join } from 'path'
import { Construct } from '@aws-cdk/core'
import { RetentionDays } from '@aws-cdk/aws-logs'
import * as ln from '@aws-cdk/aws-lambda-nodejs'

const handlerPath = (...paths: string[]) =>
  join(__dirname, '..', 'functions', ...paths)

export const createLambdaFn = (
  scope: Construct,
  id: string,
  props?: ln.NodejsFunctionProps
) => {
  return new ln.NodejsFunction(scope, id, {
    logRetention: RetentionDays.ONE_WEEK,
    handler: 'handler',
    entry: handlerPath(`${id}.ts`),
    bundling: {
      sourceMap: true,
    },
    ...props,
  })
}
