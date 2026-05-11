pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Pulling latest source code...'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t expense-tracker .'
            }
        }

        stage('Show Docker Images') {
            steps {
                sh 'docker images'
            }
        }
    }
}