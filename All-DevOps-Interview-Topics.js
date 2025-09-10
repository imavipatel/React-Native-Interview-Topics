/*

📌 1. DevOps Fundamentals
* What is DevOps – collaboration of Dev + Ops, automation, faster delivery  
* Core principles – CI/CD, Infrastructure as Code (IaC), Monitoring, Feedback loops  
* Agile vs DevOps – differences & overlap  
* SDLC (Software Development Life Cycle) in DevOps context  
* DevOps toolchain – SCM, CI/CD, IaC, Containers, Monitoring  
* Benefits – faster releases, reduced errors, better collaboration  

📌 2. Version Control (Git/GitHub/GitLab)
* Git basics – clone, commit, branch, merge, rebase  
* Git workflows – GitFlow, trunk-based development  
* Pull Requests (PRs), Merge Requests (MRs)  
* Branch protection rules  
* Tags & releases – semantic versioning  
* GitHub Actions vs GitLab CI/CD integration  

📌 3. CI/CD Pipelines
* Continuous Integration – automated testing & build on every commit  
* Continuous Delivery – deploy ready at all times  
* Continuous Deployment – automatic push to production  
* Popular CI/CD tools – GitHub Actions, GitLab CI, Jenkins, CircleCI, ArgoCD  
* Pipeline stages – build → test → package → deploy → monitor  
* Best practices – small commits, fast feedback, parallel jobs  
* Security: secrets management in pipelines (Vault, GitHub Secrets)  

📌 4. Containers (Docker)
* What is Docker – lightweight containerization vs VMs  
* Docker architecture – Docker Engine, Images, Containers, Registry  
* Writing Dockerfiles – FROM, RUN, COPY, CMD, ENTRYPOINT  
* Multi-stage builds – smaller images  
* Docker Compose – multi-container apps  
* Networking & volumes in Docker  
* Security: minimizing image vulnerabilities (scan with Trivy, Anchore)  

📌 5. Orchestration (Kubernetes)
* Why K8s – scaling, self-healing, service discovery  
* Key concepts – Pods, ReplicaSets, Deployments, Services, Ingress  
* ConfigMaps & Secrets  
* Helm charts – packaging applications  
* Autoscaling – HPA, VPA  
* StatefulSets vs Deployments  
* Security: RBAC, network policies, Pod Security Standards  
* Alternatives: Docker Swarm, ECS, Nomad  

📌 6. Cloud Computing (AWS Basics)
* AWS EC2 – launching, configuring, scaling instances  
* AWS S3 – object storage, versioning, lifecycle policies  
* AWS IAM – users, roles, policies, least privilege  
* AWS VPC – subnets, security groups, NAT, routing  
* AWS RDS – managed databases  
* AWS Lambda – serverless functions  
* Cost optimization basics – monitoring, reserved instances  
* Multi-cloud basics – Azure (VMs, AKS, Storage), GCP (GCE, GKE, Cloud Storage)  

📌 7. Infrastructure as Code (IaC)
* Why IaC – consistency, automation, repeatability  
* Terraform – providers, modules, state management  
* AWS CloudFormation – templates & stacks  
* Ansible – configuration management, playbooks, roles  
* Pulumi – IaC with real programming languages  
* Best practices – version control IaC, modularization, remote state  
* Security: never hardcode secrets in IaC  

📌 8. Linux & Shell Scripting
* Linux basics – file system, permissions, processes, signals  
* Common commands – grep, awk, sed, top, systemctl  
* Package management – apt, yum, brew  
* Shell scripting – variables, loops, conditionals, automation  
* Systemd & service management  
* Logs – journalctl, /var/log  
* Security: file permissions, sudo, SSH hardening  

📌 9. Networking & Security
* Basics – DNS, HTTP/HTTPS, TCP/IP, Load Balancers  
* Firewalls, Security Groups, NACLs  
* TLS/SSL Certificates & HTTPS setup  
* Zero Trust & least privilege models  
* VPNs & private networks in cloud  
* OWASP Top 10 for DevOps context  
* Security scanning – Snyk, Aqua, Clair  

📌 10. Artifact Management
* Why artifact repos – versioning, distribution of builds  
* Tools – JFrog Artifactory, Nexus, Harbor, AWS ECR  
* Docker image registries – Docker Hub, GitHub Container Registry  
* Version tagging & immutability  
* Security: signed images & SBOMs  

📌 11. Monitoring & Logging
* Why monitoring matters – proactive issue detection  
* Metrics, Logs, Traces – "Three Pillars of Observability"  
* Tools – Prometheus, Grafana, ELK (Elasticsearch, Logstash, Kibana), Loki  
* APM – Datadog, New Relic, AppDynamics  
* Logging best practices – structured logs, log levels  
* Alerting – PagerDuty, Opsgenie, Slack alerts  
* SLO, SLA, SLI – reliability concepts  
* Distributed tracing – OpenTelemetry, Jaeger, Zipkin  

📌 12. Configuration Management
* Why config mgmt – consistency across environments  
* Tools – Ansible, Puppet, Chef, SaltStack  
* Infrastructure drift detection  
* Secrets management – HashiCorp Vault, AWS Secrets Manager  
* Immutable vs mutable infrastructure  
* Security: encryption of sensitive configs  

📌 13. Testing in DevOps
* Unit, Integration, E2E testing in pipelines  
* Infrastructure testing – Terratest, Kitchen  
* Chaos testing – tools like Chaos Monkey, Litmus  
* Performance testing – JMeter, Locust, k6  
* Security testing – fuzzing, dependency scanning (Snyk, Trivy)  
* Canary & Blue-Green deployments for safe rollouts  

📌 14. Advanced Deployment Strategies
* Rolling deployments  
* Blue-Green deployments – switching environments  
* Canary releases – gradual rollout to % of users  
* Feature flags – toggle features without redeploy  
* Shadow deployments – test in production without impacting users  
* Infrastructure rollbacks – fast recovery strategies  

📌 15. Messaging & Streaming Systems
* Message queues – RabbitMQ, ActiveMQ  
* Streaming platforms – Apache Kafka, AWS Kinesis  
* Cloud queues – SQS, Pub/Sub  
* Use cases – async communication, decoupling, event-driven architecture  

📌 16. Databases in DevOps
* Backups & restore strategies  
* High availability – replication, clustering  
* Scaling – vertical vs horizontal, sharding  
* Monitoring – query performance, slow logs  
* Security – encryption at rest, in transit, access control  

📌 17. DevSecOps
* Shift-left security – testing earlier in pipeline  
* Static code analysis (SonarQube, CodeQL)  
* Container scanning (Trivy, Aqua)  
* Secrets detection (GitLeaks, Vault)  
* Secure CI/CD pipelines – signed artifacts, integrity checks  
* Compliance – GDPR, HIPAA, SOC2 basics for DevOps  
* Security headers & hardening images  
* Policy as Code – OPA, Conftest, Kyverno  

📌 18. Observability & Reliability (SRE Concepts)
* Error budgets & SLAs  
* Incident response playbooks  
* Chaos engineering – testing failure scenarios  
* Service mesh (Istio, Linkerd) – traffic routing, observability  
* Circuit breakers, retries, backoff patterns  
* Blameless postmortems  
* On-call management – rotations, escalation policies  

📌 19. Emerging Tools & Trends
* GitOps – ArgoCD, FluxCD  
* Serverless CI/CD – GitHub Actions + AWS Lambda  
* Platform engineering – internal developer platforms  
* FinOps – cloud cost optimization strategies  
* Edge computing with Cloudflare Workers, AWS Lambda@Edge  
* AI in DevOps – predictive monitoring, auto-remediation  
* Supply-chain security – SBOMs (Software Bill of Materials)  
* Multi-cloud & hybrid deployments  

---

📌 20. Security & Performance Checklist  

### 🔒 Security  
* Always scan Docker images for vulnerabilities  
* Store secrets in Vault/Secrets Manager, not in code  
* Use IAM least privilege principle  
* Enable MFA for all cloud accounts  
* Secure CI/CD pipelines with signed builds  
* Apply patches & upgrades regularly  
* Set up network policies in Kubernetes  
* Enable audit logs for cloud & cluster resources  
* Avoid exposing ports directly to internet  
* Monitor dependencies – `npm audit`, `pip-audit`, `snyk test`  
* Enforce policy as code (OPA/Kyverno/Conftest)  

### 🚀 Performance  
* Use auto-scaling groups (EC2, K8s HPA)  
* Implement CDN for static content  
* Cache API responses (Redis, CloudFront)  
* Optimize Docker images (multi-stage builds, alpine base)  
* Use monitoring & profiling to find bottlenecks  
* Implement log rotation & retention policies  
* Use load testing tools (k6, JMeter)  
* Pre-warm serverless functions for faster cold starts  
* Enable caching for CI/CD (npm, pip, docker layers)  

### 🛠 Build & Deployment  
* Use IaC (Terraform, Ansible) for repeatable environments  
* Tag all builds with version & commit hash  
* Automate rollback strategies in CI/CD  
* Use staging environments before prod  
* Enable linting & formatting in pipelines  
* Use GitOps for K8s deployments  
* Apply security scans in CI/CD (Trivy, Snyk, Checkov)  
* Automate cost monitoring (AWS Budgets, Grafana dashboards)  
* Use artifact repos (Artifactory, Nexus, ECR) for builds  

*/
