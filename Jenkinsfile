pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "pratham0010"

        LOCAL_BACKEND = "pratham-devops-app-backend"
        LOCAL_FRONTEND = "pratham-devops-app-frontend"
        LOCAL_AGENT = "pratham-devops-app-ai-agent"

        HUB_BACKEND = "pratham0010/pratham-devops-app-backend"
        HUB_FRONTEND = "pratham0010/pratham-devops-app-frontend"
        HUB_AGENT = "pratham0010/pratham-devops-app-ai-agent"

        DOCKER_CREDENTIALS_ID = "dockerhub-credentials"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Pratham-5571-spec/react-devops.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat '''
                docker compose build
                docker images
                '''
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKER_CREDENTIALS_ID,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS')]) {

                    bat '''
                    echo %PASS% | docker login -u %USER% --password-stdin
                    '''
                }
            }
        }

        stage('Tag Images') {
            steps {
                bat '''
                docker tag %LOCAL_BACKEND% %HUB_BACKEND%:latest
                docker tag %LOCAL_FRONTEND% %HUB_FRONTEND%:latest
                docker tag %LOCAL_AGENT% %HUB_AGENT%:latest
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                bat '''
                docker push %HUB_BACKEND%:latest
                docker push %HUB_FRONTEND%:latest
                docker push %HUB_AGENT%:latest
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                bat '''
                docker compose down
                docker compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline Completed Successfully'
        }
        failure {
            echo '❌ Pipeline Failed'
        }
    }
}