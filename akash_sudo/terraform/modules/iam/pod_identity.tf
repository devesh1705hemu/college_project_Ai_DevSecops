data "aws_iam_policy_document" "app_pod_identity_assume" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["pods.eks.amazonaws.com"]
    }
    actions = [
      "sts:AssumeRole",
      "sts:TagSession"
    ]
  }
}

resource "aws_iam_role" "app_pod_identity" {
  name               = "${var.project_name}-${var.environment}-app-pod-role"
  assume_role_policy = data.aws_iam_policy_document.app_pod_identity_assume.json
}

data "aws_iam_policy_document" "app_secret_read" {
  statement {
    sid       = "ReadNamedApplicationSecret"
    effect    = "Allow"
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [var.application_secret_arn]
  }
}

resource "aws_iam_role_policy" "app_secret_read" {
  name   = "read-application-secret"
  role   = aws_iam_role.app_pod_identity.id
  policy = data.aws_iam_policy_document.app_secret_read.json
}
