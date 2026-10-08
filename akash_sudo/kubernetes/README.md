# Kubernetes Security Baseline

These manifests implement the Cloud Security workstream only.

## Apply order

1. Apply RBAC and namespace:
   kubectl apply -f rbac.yaml

2. Apply the default-deny policy:
   kubectl apply -f network-policy.yaml

3. Replace REPLACE_WITH_ECR_DIGEST in pod-security.yaml with the exact ECR image digest supplied by the application/DevOps workstream.

4. Apply the hardened workload reference:
   kubectl apply -f pod-security.yaml

The application team must add any explicitly required ingress or external egress rules. The default baseline intentionally denies traffic that has not been approved.

## Security properties

- Namespace Pod Security labels use the restricted profile.
- ServiceAccount has only namespace-scoped read access to the named ConfigMap.
- Pod Identity supplies temporary AWS credentials.
- ServiceAccount token auto-mount is disabled.
- Containers run as non-root, use read-only root filesystems, drop all Linux capabilities and disable privilege escalation.
- Default network policy is deny-by-default.
