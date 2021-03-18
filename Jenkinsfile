pipeline{
    agent any
    stages{
        stage('Front-end') {
            agent {
                docker { dockerfile true }
            }
            steps {
                sh 'node --version'
            }
        }
    }
}