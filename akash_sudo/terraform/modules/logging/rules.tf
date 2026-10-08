resource "aws_config_config_rule" "cloudtrail_enabled" {
  name        = "${var.project_name}-cloudtrail-enabled"
  description = "Require an enabled multi-region CloudTrail trail."

  source {
    owner             = "AWS"
    source_identifier = "CLOUD_TRAIL_ENABLED"
  }

  depends_on = [aws_config_configuration_recorder_status.this]
}

resource "aws_config_config_rule" "vpc_default_sg_closed" {
  name        = "${var.project_name}-vpc-default-security-group-closed"
  description = "Require the default VPC security group to have no rules."

  source {
    owner             = "AWS"
    source_identifier = "VPC_DEFAULT_SECURITY_GROUP_CLOSED"
  }

  depends_on = [aws_config_configuration_recorder_status.this]
}

resource "aws_config_config_rule" "ecr_scan" {
  name        = "${var.project_name}-ecr-scan"
  description = "Require scan-on-push or continuous ECR scanning for project repositories."

  source {
    owner             = "AWS"
    source_identifier = "ECR_PRIVATE_IMAGE_SCANNING_ENABLED"
  }

  scope {
    tag_key   = "Project"
    tag_value = var.project_name
  }

  depends_on = [aws_config_configuration_recorder_status.this]
}

resource "aws_config_config_rule" "ecr_lifecycle" {
  name        = "${var.project_name}-ecr-lifecycle"
  description = "Require ECR lifecycle policies for project repositories."

  source {
    owner             = "AWS"
    source_identifier = "ECR_PRIVATE_LIFECYCLE_POLICY_CONFIGURED"
  }

  scope {
    tag_key   = "Project"
    tag_value = var.project_name
  }

  depends_on = [aws_config_configuration_recorder_status.this]
}

resource "aws_config_config_rule" "ecr_immutable_tags" {
  name        = "${var.project_name}-ecr-immutable-tags"
  description = "Require immutable ECR image tags for project repositories."

  source {
    owner             = "AWS"
    source_identifier = "ECR_PRIVATE_TAG_IMMUTABILITY_ENABLED"
  }

  scope {
    tag_key   = "Project"
    tag_value = var.project_name
  }

  depends_on = [aws_config_configuration_recorder_status.this]
}

resource "aws_config_config_rule" "ecr_cmk" {
  name        = "${var.project_name}-ecr-cmk"
  description = "Require customer-managed KMS encryption for project ECR repositories."

  source {
    owner             = "AWS"
    source_identifier = "ECR_REPOSITORY_CMK_ENCRYPTION_ENABLED"
  }

  scope {
    tag_key   = "Project"
    tag_value = var.project_name
  }

  depends_on = [aws_config_configuration_recorder_status.this]
}

resource "aws_config_config_rule" "secretsmanager_cmk" {
  name        = "${var.project_name}-secretsmanager-cmk"
  description = "Require customer-managed KMS encryption for project Secrets Manager secrets."

  source {
    owner             = "AWS"
    source_identifier = "SECRETSMANAGER_USING_CMK"
  }

  scope {
    tag_key   = "Project"
    tag_value = var.project_name
  }

  depends_on = [aws_config_configuration_recorder_status.this]
}

resource "aws_config_config_rule" "vpc_flow_logs_enabled" {
  name        = "${var.project_name}-vpc-flow-logs"
  description = "Require VPC Flow Logs on the project VPC."

  source {
    owner             = "AWS"
    source_identifier = "VPC_FLOW_LOGS_ENABLED"
  }

  scope {
    compliance_resource_id    = var.vpc_id
    compliance_resource_types = ["AWS::EC2::VPC"]
  }

  depends_on = [aws_config_configuration_recorder_status.this]
}
