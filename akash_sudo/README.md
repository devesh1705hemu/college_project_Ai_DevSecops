# Akash - Cloud Security Engineer Workstream

This repository contains only my assigned Cloud Security Engineer implementation for the AI-Powered DevSecOps project.

## Security architecture

AWS VPC
-> private subnets
-> EKS
-> hardened managed node group
-> EKS Pod Identity
-> least-privilege application IAM
-> customer-managed encrypted Secrets Manager
-> ECR
-> CloudTrail + AWS Config

## Implemented controls

### AWS foundation
- VPC with public/private subnet segmentation.
- Private worker subnets and NAT egress.
- No unrestricted inbound baseline security group.
- Private Secrets Manager interface endpoint.
- VPC Flow Logs capturing accepted and rejected network traffic to CloudWatch Logs.
- CloudTrail multi-region audit logging.
- AWS Config recording and S3 delivery.
- Managed AWS Config compliance rules for CloudTrail, VPC default security groups, ECR scanning/lifecycle/immutability/CMK encryption and Secrets Manager CMK encryption.
- Versioned and encrypted audit buckets.

### IAM and workload identity
- Dedicated EKS cluster role.
- Dedicated EKS node role.
- AWS-managed ECR pull-only permissions required by EKS node-hosted platform components.
- Amazon EKS VPC CNI permissions isolated to a dedicated networking workload role.
- EKS Pod Identity trust and association for the application ServiceAccount.
- Application IAM is limited to the exact Secrets Manager ARN and its exact customer-managed KMS key.
- Explicit EKS Access Entry for a supplied IAM admin role.
- Bootstrap cluster-creator admin access is disabled.
- EKS API-only access-entry mode is used instead of the legacy aws-auth path.

### EKS
- Kubernetes 1.35 baseline.
- Private API endpoint by default.
- API audit, authenticator, controller manager and scheduler logging.
- Customer-managed KMS key for Kubernetes Secrets encryption.
- Pod Identity Agent managed add-on with IPv4 credential endpoint configuration.
- AL2023 managed node group.
- IMDSv2 required with hop limit 1.
- Managed node scaling 1-3 nodes.

### Kubernetes workload security
- Restricted Pod Security namespace labels.
- Application ServiceAccount has no Kubernetes API permissions by default.
- Default-deny ingress and egress.
- DNS-only cluster egress plus VPC HTTPS and Pod Identity credential endpoint.
- Non-root container.
- Read-only root filesystem.
- All Linux capabilities dropped.
- Privilege escalation disabled.
- RuntimeDefault seccomp.
- ServiceAccount token auto-mount disabled.
- Resource requests and limits.

### ECR
- Immutable image tags.
- Scan on push.
- Customer-managed KMS encryption.
- 30-image lifecycle retention.
- Deployment should use immutable image digests.

## Secrets workflow

Terraform creates the secret container and customer-managed KMS key, but never creates or stores the secret value.

After infrastructure creation, populate the value through an approved AWS Secrets Manager workflow. Never place the real value in Git, Terraform variables, manifests or source code.

## Validation

From a machine with AWS and kubectl access:

bash akash_sudo/security-validation/validate.sh

Also run:

terraform fmt -check -recursive
terraform init
terraform validate
terraform plan

For the private EKS endpoint, kubectl must run from the VPC or a connected network such as a VPN or controlled bastion/SSM host.

## Team boundary

Application development, CI/CD implementation, Prometheus/Grafana/AlertManager and AI assistant work are outside this workstream. This folder supplies the security controls consumed by those components.

Never commit AWS credentials, secrets, Terraform state, kubeconfig files or real tfvars.
