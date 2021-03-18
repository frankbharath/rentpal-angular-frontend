pipeline{
    agent any
    stages{
        stage('Front-end') {
            agent { dockerfile true }
            steps {
                sh 'ng build --prod'
            }
        }
    }
}