output "cloudtrail_name" { value = aws_cloudtrail.this.name }
output "cloudtrail_bucket_name" { value = aws_s3_bucket.cloudtrail.id }
output "config_bucket_name" { value = aws_s3_bucket.config.id }
output "config_role_arn" { value = aws_iam_role.config.arn }
output "config_rule_names" {
  value = [
    aws_config_config_rule.cloudtrail_enabled.name,
    aws_config_config_rule.vpc_default_sg_closed.name,
    aws_config_config_rule.ecr_scan.name,
    aws_config_config_rule.ecr_lifecycle.name,
    aws_config_config_rule.ecr_immutable_tags.name,
    aws_config_config_rule.ecr_cmk.name,
    aws_config_config_rule.secretsmanager_cmk.name,
    aws_config_config_rule.vpc_flow_logs_enabled.name
  ]
}
