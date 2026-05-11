pipeline {
    agent any

    stages {

        stage('Build Containers') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Show Docker Images') {
            steps {
                sh 'docker images'
            }
        }
    }
}