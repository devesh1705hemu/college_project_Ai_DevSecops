variable "project_name" { type = string }
variable "environment" { type = string }
variable "aws_region" { type = string }

variable "application_secret_arn" {
  type        = string
  description = "Exact Secrets Manager ARN the application workload may read."
}

variable "application_secret_kms_key_arn" {
  type        = string
  description = "Exact KMS key ARN used to encrypt the application secret."
}
