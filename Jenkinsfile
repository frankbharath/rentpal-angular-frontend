pipeline {
    agent any
    environment{
        AWS_ACCESS_KEY_ID = credentials('access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('secret-access-key')
        AWS_S3_BUCKET = 'rentpal'
        VERSION = "${env.BUILD_NUMBER}"
        DIST_ARCHIVE = "dist.${env.BUILD_NUMBER}"   
    }
    stages {
        stage('Build') { 
            steps {
                withDockerContainer(args: '-u root', image: 'node:14.15.1') {
                    sh 'npm install' 
                    sh 'npm run ng build -- --configuration=production'
                }
            }
        }
        stage('Archive') {
            steps {
              sh "cd dist && zip -r ../${DIST_ARCHIVE}.zip . && cd .."
              archiveArtifacts artifacts: "${DIST_ARCHIVE}.zip"
            }
        }
        stage('Deploy') {
            steps {
                sh 'aws s3 sync ./dist/app s3://${AWS_S3_BUCKET}/ --acl=public-read --delete'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}