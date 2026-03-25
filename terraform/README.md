# 🌍 Infrastructure (Terraform)

This folder contains the **real infrastructure definition** of the project using Terraform.

It is the **single source of truth** for everything deployed to AWS.

## 🧠 Purpose

This layer is responsible for provisioning:

- AWS Lambda functions
- Amazon API Gateway
- SQS / SNS (event-driven architecture)
- IAM roles and permissions
- Any other cloud resources

Built with: Terraform

## 🚀 How to deploy

### 1. Initialize Terraform

```bash
terraform init
terraform plan
terraform apply
```