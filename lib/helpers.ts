import { join } from 'path'
import { Construct } from '@aws-cdk/core'
import { RetentionDays } from '@aws-cdk/aws-logs'
import * as ln from '@aws-cdk/aws-lambda-nodejs'

const lambdaDir = join(__dirname, '..', 'functions')

const lockfilePath = join(lambdaDir, 'yarn.lock')

const handlerPath = (...paths: string[]) => join(lambdaDir, 'src', ...paths)

export const createLambdaFn = (
  scope: Construct,
  id: string,
  props?: ln.NodejsFunctionProps
) => {
  return new ln.NodejsFunction(scope, id, {
    functionName: id,
    logRetention: RetentionDays.ONE_WEEK,
    handler: 'handler',
    entry: handlerPath(`${id}.ts`),
    depsLockFilePath: lockfilePath,
    bundling: {
      sourceMap: true,
    },
    ...props,
  })
}
