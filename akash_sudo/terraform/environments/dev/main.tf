module "vpc" {
  source = "../../modules/vpc"
  project_name = var.project_name
  environment = var.environment
  aws_region = var.aws_region
  vpc_cidr = var.vpc_cidr
  availability_zones = var.availability_zones
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  single_nat_gateway = var.single_nat_gateway
}

module "ecr" {
  source = "../../modules/ecr"
  project_name = var.project_name
  environment = var.environment
}

module "secrets_manager" {
  source = "../../modules/secrets-manager"
  project_name = var.project_name
  environment = var.environment
}

module "iam" {
  source = "../../modules/iam"
  project_name = var.project_name
  environment = var.environment
  aws_region = var.aws_region
  application_secret_arn = module.secrets_manager.application_secret_arn
  application_secret_kms_key_arn = module.secrets_manager.application_secret_kms_key_arn
}

module "logging" {
  source = "../../modules/logging"
  project_name = var.project_name
  environment = var.environment
  vpc_id = module.vpc.vpc_id
}

module "eks" {
  source = "../../modules/eks"
  cluster_name = "${var.project_name}-${var.environment}"
  cluster_version = var.eks_cluster_version
  subnet_ids = module.vpc.private_subnet_ids
  cluster_role_arn = module.iam.eks_cluster_role_arn
  node_role_arn = module.iam.eks_node_role_arn
  security_group_ids = [module.vpc.baseline_security_group_id]
  endpoint_public_access = var.eks_public_endpoint
  endpoint_private_access = true
  app_pod_identity_role_arn = module.iam.app_pod_identity_role_arn
  vpc_cni_pod_identity_role_arn = module.iam.vpc_cni_pod_identity_role_arn
  admin_principal_arn = var.eks_admin_principal_arn
}
