pipeline {
    agent any
    
    environment {
        // Set the SonarQube server URL and authentication token as environment variables
        MAVEN_HOME = tool name: 'maven3', type: 'maven'
        SONAR_HOST_URL = 'http://ip:9000'
        SONAR_AUTH_TOKEN = credentials('sonar-token') // Store your SonarQube token in Jenkins credentials
        DOCKER_IMAGE = "/app/target/spring-boot-****"
        DOCKER_REGISTRY_CREDENTIALS = 'docker-registry-credentials' // Jenkins credentials ID for Docker registry
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', changelog: false, credentialsId: 'jenkins', poll: false, url: 'https://github.com/*****'
            }
        }

        stage('Build') {
            steps {
                sh "${MAVEN_HOME}/bin/mvn clean install"
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') { // 'SonarQube' is the name of the SonarQube installation in Jenkins
                    sh "mvn sonar:sonar -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.login=$SONAR_AUTH_TOKEN"
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_REGISTRY_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }
    }

    post {
        success {
            echo 'Build, SonarQube analysis, and Docker push completed successfully.'
        }
        failure {
            echo 'Build failed. Check logs for more details.'
        }
    }
}
