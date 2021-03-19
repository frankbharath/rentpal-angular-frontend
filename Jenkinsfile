pipeline{
    agent any
    stages{
        stage('Front-end') {
            agent { dockerfile true }
            steps {
                //sh 'ls'
                sh 'ng build --prod'
            }
        }
    }
}