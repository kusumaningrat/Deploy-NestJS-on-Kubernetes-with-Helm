// Uses Declarative syntax to run commands inside a container.
pipeline {
    agent any
    options{
        disableConcurrentBuilds()
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '15')
    }
    environment{
        NAMESPACE = "default"
        IMAGE = "kusumaningrat16/simple-nestjs-api"
        FAILED_STAGE=''
    }
    stages {
        stage('Pull Repo') {
            steps {
                script{
                    timeout(time: 30){
                        FAILED_STAGE='Pull Repo'
                        git branch: 'dev', credentialsId: 'github', url: 'git@github.com:kusumaningrat/kusumaningrat-Deploy-NestJS-on-Kubernetes-with-Helm.git'
                    }
                }
            }
        }
        stage('Build'){
            steps{
                script{
                    timeout(time:30){
                        FAILED_STAGE='Build'
                        withCredentials([usernamePassword(credentialsId: 'docker_hub')]){
                            sh "docker build -t ${IMAGE}:${params.VERSION} ."
                            sh "docker push ${IMAGE}:${params.VERSION}"
                        }
                    }
                
                }
            }
        }
        stage('Clone Helm Repo'){
            steps{
                script{
                    timeout(time: 30){
                        FAILED_STAGE= 'Helm'
                        git branch: 'helm', credentialsId: 'github', url: 'git@github.com:kusumaningrat/kusumaningrat-Deploy-NestJS-on-Kubernetes-with-Helm.git'
                    }
                }
            }
        }
        // stage('Deploy'){
        //     steps{
        //         script{
        //             timeout(time: 30){
        //                 FAILED_STAGE='Deploy'
        //                 withKubeConfig([credentialsId: 'fba1e179-6e2b-4c53-a2e6-4855f795748f']){
        //                     sh "helm upgrade --install --set image.tag=${params.VERSION}-${env.ENV} --atomic --wait ${env.SERVICE} helm -n ${env.NAMESPACE}"
        //                     sh "kubectl rollout status deployment ${env.SERVICE} -n ${env.NAMESPACE}"
        //                 }
        //             } 
        //         }
        //     }
        // }
    }
}