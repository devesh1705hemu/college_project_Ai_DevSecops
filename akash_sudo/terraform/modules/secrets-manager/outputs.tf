output "application_secret_arn" {
  value = aws_secretsmanager_secret.app.arn
}

output "application_secret_name" {
  value = aws_secretsmanager_secret.app.name
}

output "application_secret_kms_key_arn" {
  value = aws_kms_key.app.arn
}
