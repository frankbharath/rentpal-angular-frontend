pipeline{
    agent any
    stages{
        stage('Front-end') {
            agent { dockerfile true }
            steps {
                //sh 'ls'
                sh 'npm run build --prod'
            }
        }
    }
}