// Uses Declarative syntax to run commands inside a container.
pipeline {
    agent any
    options{
        disableConcurrentBuilds()
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '15')
    }
    parameters {
        string(name: 'HUB_USERNAME', description: 'Docker Hub Username')
        string(name: 'HUB_PASSWORD', description: 'Docker Hub Password')
    }
    environment {
        NAMESPACE = "default"
        IMAGE = "${HUB_USERNAME}/simple-nestjs-api"
        FAILED_STAGE=''
        GENERATED_TAG=''
        IMAGE_NAME=''
    }
    
    stages {
        stage('Pull Repo') {
            steps {
                script{
                    timeout(time: 30){
                        FAILED_STAGE='Pull Repo'
                        git branch: 'dev', credentialsId: 'github', url: 'https://github.com/kusumaningrat/Deploy-NestJS-on-Kubernetes-with-Helm.git'
                    }
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    FAILED_STAGE='Build'
                    timeout(time: 30){
                        def currentDate = sh(returnStdout: true, script: 'date +"%Y%m%d"').trim()
                        def uid = UUID.randomUUID().toString().substring(0, 6)
                        def combinedString = "${currentDate}-${uid}"
                        def image = "${env.IMAGE}:${combinedString}"
                        env.GENERATED_IMAGE= "${env.IMAGE}:${combinedString}"
                        
                        echo "Current Date + UID: ${combinedString}"

                        dockerImage = docker.build image
                    }
                }
            }
        }
        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'HUB_USERNAME', passwordVariable: 'HUB_PASSWORD')]) {
                    script {
                        FAILED_STAGE = 'Push'
                        // Login to Docker Hub
                        sh("echo '${HUB_PASSWORD}' | docker login -u '${HUB_USERNAME}' --password-stdin https://index.docker.io/v1/")
                        // Push the image
                        docker.image("${env.GENERATED_IMAGE}").push()
                    }
                }
            }
        }

    }
}