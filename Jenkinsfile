pipeline {
    agent any

    environment {
        AWS_REGION         = 'ap-south-1'
        BACKEND_ECR        = credentials('BACKEND_ECR')
        FRONTEND_ECR       = credentials('FRONTEND_ECR')
        AWS_ACCESS_KEY_ID  = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    }

    stages {

        stage('Login to AWS ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin 299139630689.dkr.ecr.ap-south-1.amazonaws.com
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

        stage('Deploy To Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}