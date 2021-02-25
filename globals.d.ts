declare namespace NodeJS {
  export interface ProcessEnv {
    AWS_REGION: string
    ECS_CLUSTER_NAME: string
    ECS_TASK_DEFINITION: string
    VPC_SUBNETS: string
    VPC_SECURITY_GROUP: string
  }
}
