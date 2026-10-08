output "eks_cluster_role_arn" { value = aws_iam_role.eks_cluster.arn }
output "eks_node_role_arn" { value = aws_iam_role.eks_node.arn }
output "app_pod_identity_role_arn" { value = aws_iam_role.app_pod_identity.arn }
output "vpc_cni_pod_identity_role_arn" { value = aws_iam_role.vpc_cni.arn }
