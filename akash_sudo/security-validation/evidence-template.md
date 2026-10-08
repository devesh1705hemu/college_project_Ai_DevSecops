# Security Evidence Template

Use this file as the evidence index for the final project report. Store screenshots separately; never store credentials or secret values.

| Control | Evidence to capture | Expected result |
|---|---|---|
| VPC segmentation | VPC/subnet console or AWS CLI output | Worker subnets are private |
| EKS endpoint | validate.sh output | public=false, private=true |
| EKS logs | validate.sh output | API/audit/authenticator/controller/scheduler enabled |
| Kubernetes encryption | validate.sh output | customer-managed KMS key present |
| Node OS | EKS node group details | AL2023 |
| IMDS | launch template details | IMDSv2 required, hop limit 1 |
| IAM | IAM role policy view | app role reads only exact secret; node role pulls only exact ECR repository |
| Pod Identity | EKS association + addon | application ServiceAccount mapped to dedicated role |
| Secrets Manager | secret metadata | secret value not stored in repository |
| ECR | repository configuration | immutable tags, scan enabled, KMS encryption |
| CloudTrail | trail status | logging enabled, multi-region |
| AWS Config | recorder status | recording enabled |
| NetworkPolicy | kubectl output | default deny present |
| Pod security | namespace/deployment manifest | restricted, non-root, no privilege escalation, read-only root |
| RBAC | kubectl auth can-i output | only required namespace permission |

Sanitize screenshots before sharing. Remove account IDs where not needed, access keys, tokens, kubeconfig data and secret values.
