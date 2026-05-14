pipeline {
    agent any

    environment {
        AWS_REGION            = 'ap-south-1'
        BACKEND_ECR           = credentials('BACKEND_ECR')
        FRONTEND_ECR          = credentials('FRONTEND_ECR')
        AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        EKS_CLUSTER_NAME      = 'expense-cluster'
    }

    stages {

        stage('Fix Docker Permissions') {
            steps {
                sh '''
                chmod 666 /var/run/docker.sock
                echo "Docker socket permissions fixed"
                docker --version
                '''
            }
        }

        stage('Login to AWS ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin 385105852446.dkr.ecr.ap-south-1.amazonaws.com
                '''
            }
        }

        stage('Build Containers') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Tag Backend Image') {
            steps {
                sh 'docker tag expance-backend:latest $BACKEND_ECR:latest'
            }
        }

        stage('Tag Frontend Image') {
            steps {
                sh 'docker tag expance-frontend:latest $FRONTEND_ECR:latest'
            }
        }

        stage('Push Backend Image') {
            steps {
                sh 'docker push $BACKEND_ECR:latest'
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh 'docker push $FRONTEND_ECR:latest'
            }
        }

        stage('Configure kubectl') {
            steps {
                sh '''
                set -e
                TOKEN=$(aws eks get-token --cluster-name $EKS_CLUSTER_NAME --region $AWS_REGION --query "status.token" --output text)
                SERVER=$(aws eks describe-cluster --name $EKS_CLUSTER_NAME --region $AWS_REGION --query "cluster.endpoint" --output text)
                CA=$(aws eks describe-cluster --name $EKS_CLUSTER_NAME --region $AWS_REGION --query "cluster.certificateAuthority.data" --output text)

                echo "SERVER: $SERVER"
                echo "CA length: ${#CA}"
                echo "TOKEN length: ${#TOKEN}"

                cat > /tmp/kubeconfig.yaml <<EOF
apiVersion: v1
kind: Config
clusters:
- cluster:
    server: ${SERVER}
    certificate-authority-data: ${CA}
  name: expense-cluster
contexts:
- context:
    cluster: expense-cluster
    user: aws-user
  name: expense-cluster
current-context: expense-cluster
users:
- name: aws-user
  user:
    token: ${TOKEN}
EOF
                echo "Kubeconfig created successfully"
                '''
            }
        }

        stage('Deploy To Kubernetes') {
            steps {
                sh '''
                kubectl --kubeconfig=/tmp/kubeconfig.yaml delete -f k8s/ --ignore-not-found=true --wait=true
                echo "Waiting for resources to fully terminate..."
                sleep 10
                kubectl --kubeconfig=/tmp/kubeconfig.yaml apply -f k8s/
                '''
            }
        }
    }
}