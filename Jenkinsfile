pipeline{
    agent any
    stages{
        stage('Front-end') {
            agent { dockerfile true }
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }
    }
}