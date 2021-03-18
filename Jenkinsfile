pipeline{
    agent any
    stages{
        stage('Front-end') {
            agent {
                docker { image 'node:14.15.1' }
            }
            steps {
                sh 'node --version'
            }
        }
    }
}