output "vpc_id" { value = aws_vpc.this.id }
output "public_subnet_ids" { value = aws_subnet.public[*].id }
output "private_subnet_ids" { value = aws_subnet.private[*].id }
output "baseline_security_group_id" { value = aws_security_group.baseline.id }
output "vpc_cidr" { value = aws_vpc.this.cidr_block }
output "vpc_flow_log_id" { value = aws_flow_log.vpc.id }
output "vpc_flow_log_group_name" { value = aws_cloudwatch_log_group.flow_logs.name }
