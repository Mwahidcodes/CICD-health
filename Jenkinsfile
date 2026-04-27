pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-backend-app"
        CONTAINER_NAME = "my-backend-container"
        APP_PORT = "3000"
        EMAIL_TO = "mariawahid999@gmail.com"
    }

    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                    docker run -d \
                    --name $CONTAINER_NAME \
                    -p $APP_PORT:3000 \
                    --restart unless-stopped \
                    $IMAGE_NAME:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'docker ps'
                sh 'curl -f http://localhost:3000'
            }
        }
    }

    post {
        success {
            emailext(
                to: "${EMAIL_TO}",
                subject: "SUCCESS: Jenkins Deployment - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                mimeType: "text/html",
                body: """
                    <h2 style="color:green;">Deployment Successful</h2>
                    <p>Your CI/CD pipeline completed successfully.</p>
                    <p><b>Project:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Status:</b> SUCCESS</p>
                    <p><b>App URL:</b> <a href="http://13.62.101.141:3000">http://13.62.101.141:3000</a></p>
                    <p><b>Jenkins Build:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p>Regards,<br>Jenkins CI/CD</p>
                """
            )
        }

        failure {
            emailext(
                to: "${EMAIL_TO}",
                subject: "FAILED: Jenkins Deployment - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                mimeType: "text/html",
                body: """
                    <h2 style="color:red;">Deployment Failed</h2>
                    <p>Your CI/CD pipeline failed.</p>
                    <p><b>Project:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Status:</b> FAILED</p>
                    <p><b>Jenkins Build:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p>Please check Jenkins Console Output.</p>
                    <p>Regards,<br>Jenkins CI/CD</p>
                """
            )
        }
    }
}