# ECR Security Checklist

- [x] Private repository
- [x] Immutable image tags
- [x] Scan on push
- [x] Customer-managed KMS encryption
- [x] KMS key rotation enabled
- [x] Lifecycle retention policy
- [x] EKS node image-pull access enabled with AWS-managed pull-only permissions
- [x] Deployment uses an immutable image digest
- [ ] Enhanced ECR/Inspector scanning enabled if the team approves the additional Inspector cost
- [ ] Security findings reviewed before promotion

The node IAM role uses AWS's pull-only ECR policy because EKS node-hosted components and managed add-ons also pull container images from ECR. Restricting the node role to only the project repository would break those platform components.

Never store registry credentials in source code. Prefer AWS IAM-based authentication.
