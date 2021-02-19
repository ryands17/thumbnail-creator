import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert'
import { createStack } from './helpers'

test('VPC is created along with security groups', () => {
  const stack = createStack()

  expectCDK(stack).to(
    haveResourceLike('AWS::EC2::VPC', {
      CidrBlock: '10.0.0.0/21',
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
      InstanceTenancy: 'default',
    })
  )

  for (let i of [0, 2, 4, 6])
    expectCDK(stack).to(
      haveResourceLike('AWS::EC2::Subnet', {
        CidrBlock: `10.0.${i}.0/23`,
        VpcId: {},
        AvailabilityZone: {},
      })
    )
})
