pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-backend-app"
        CONTAINER_NAME = "my-backend-container"
        APP_PORT = "3000"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository from GitHub...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    docker build -t $IMAGE_NAME:latest .
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                echo 'Stopping old container if exists...'
                sh '''
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                echo 'Running new container...'
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
                echo 'Checking running containers...'
                sh 'docker ps'

                echo 'Testing app endpoint...'
                sh 'curl -f http://localhost:3000'
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }

        failure {
            echo 'Deployment failed. Check console logs.'
        }
    }
}