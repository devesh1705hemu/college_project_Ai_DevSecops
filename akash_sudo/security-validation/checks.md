Cloud Security Validation

Terraform:
- terraform fmt -check -recursive
- terraform init
- terraform validate
- terraform plan

AWS:
- Verify EKS endpoint is private unless explicitly required.
- Verify worker nodes use private subnets.
- Verify IAM roles do not contain unnecessary AdministratorAccess.
- Verify ECR tag mutability is IMMUTABLE.
- Verify ECR scan-on-push is enabled.
- Verify CloudTrail is delivering logs.
- Verify AWS Config recorder is active.
- Verify AWS Config managed security rules exist and are evaluating the project controls.
- Verify EKS control-plane audit logs are enabled.
- Verify KMS key rotation is enabled.

Kubernetes:
- kubectl auth can-i --list --as=system:serviceaccount:ai-devsecops:app
- kubectl get networkpolicy -n ai-devsecops
- Verify the VPC CNI networking workload uses its dedicated IAM role.
- Verify restricted Pod Security labels.
- Verify application containers run as non-root.
- Verify privilege escalation is disabled.

Never commit credentials, tokens, kubeconfig files, secret values, or private keys.
