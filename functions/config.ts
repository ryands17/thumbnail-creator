export const envs = {
  AWS_REGION: process.env.AWS_REGION,
  ECS_CLUSTER_NAME: process.env.ECS_CLUSTER_NAME,
  ECS_TASK_DEFINITION: process.env.ECS_TASK_DEFINITION,
  VPC_SUBNETS: process.env.VPC_SUBNETS?.split(','),
  VPC_SECURITY_GROUP: process.env.VPC_SECURITY_GROUP,
}
