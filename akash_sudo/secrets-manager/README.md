# AWS Secrets Manager Security Model

Application secrets must live in AWS Secrets Manager, never in Git, Dockerfiles, Terraform variables, ConfigMaps, Kubernetes manifests, or source code.

Access model:

AWS Secrets Manager
-> private VPC interface endpoint
-> EKS Pod Identity
-> dedicated application ServiceAccount
-> exact secret ARN

## Terraform

Terraform creates the named application secret container, but intentionally does not create a secret value. This prevents credentials from entering Terraform configuration or state.

After infrastructure creation, populate the value through a secure operator workflow. Example:

1. Get the secret name:
   terraform output -raw application_secret_arn

2. Use an approved secrets-management workflow or AWS Secrets Manager console/CLI to set the value.

Do not put real values into .tfvars, Git, Kubernetes YAML, Dockerfiles or shell history.

## IAM controls

- Application role is limited to secretsmanager:GetSecretValue.
- The resource is the exact Terraform-created secret ARN.
- No wildcard secret access.
- Pod Identity trust uses pods.eks.amazonaws.com.
- CloudTrail records Secrets Manager API activity.
- The application reaches Secrets Manager through the private VPC endpoint.

## Kubernetes behavior

The application ServiceAccount is associated with the IAM role through EKS Pod Identity. The Pod Identity Agent provides temporary credentials to the workload; static AWS access keys are not used.
