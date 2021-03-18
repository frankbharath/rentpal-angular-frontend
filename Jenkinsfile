pipeline{
    agent any
    stages{
        stage('Front-end') {
            agent { dockerfile true }
            steps {
                sh 'tsc --version'
            }
        }
    }
}