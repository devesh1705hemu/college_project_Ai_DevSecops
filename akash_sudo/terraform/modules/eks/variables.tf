variable "cluster_name" { type = string }
variable "cluster_version" { type = string default = "1.35" }
variable "subnet_ids" { type = list(string) }
variable "cluster_role_arn" { type = string }
variable "node_role_arn" { type = string }
variable "security_group_ids" { type = list(string) default = [] }
variable "endpoint_public_access" { type = bool default = false }
variable "endpoint_private_access" { type = bool default = true }
variable "app_pod_identity_role_arn" { type = string }
variable "vpc_cni_pod_identity_role_arn" { type = string }
variable "admin_principal_arn" { type = string }
