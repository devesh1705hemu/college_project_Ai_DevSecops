resource "aws_kms_key" "app" {
  description             = "KMS key for application Secrets Manager secret"
  deletion_window_in_days = 7
  enable_key_rotation     = true
}

resource "aws_kms_alias" "app" {
  name          = "alias/ai-devsecops-secrets"
  target_key_id = aws_kms_key.app.key_id
}

resource "aws_secretsmanager_secret" "app" {
  name                    = "${var.project_name}/${var.environment}/app"
  description             = "Application secret container. Populate the value manually or through the deployment process."
  kms_key_id              = aws_kms_key.app.arn
  recovery_window_in_days = 7
}
