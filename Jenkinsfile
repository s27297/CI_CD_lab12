pipeline{
    triggers{
        pollSCM('* * * * *')
//         githubPush()
    }
     agent any

    environment {
//         API_KEY     = credentials('api-key-id')
        SONARQUBE_SERVER = 'CI_CD_lab12'
        REPORT_DIR  = 'target/reports'
        SONARQUBE_IN_JENKINS='SonarQube'
    }
    stages{
        stage('checkout'){
           steps{

                        echo "BRANCH_NAME: ${env.BRANCH_NAME}"
                              echo "GIT_BRANCH: ${env.GIT_BRANCH}"
                         sh ' def qwer = env.GIT_BRANCH.replaceFirst(/^origin\//, '')'
                           echo qwer
                  git url: 'https://github.com/s27297/CI_CD_lab12', branch: "main"
           }
        }
             stage('Pytanie'){
                  when {
                        expression {
                            return env.GIT_BRANCH?.endsWith('/main')
                        }
                 }

                 steps{
                     script {
                         def userInput = input message: 'Czy chcesz kontynuować wdrożenie?', ok: 'Tak'
                         echo "Użytkownik zatwierdził kontynuację."
                     }
                 }
             }
        stage("dependences"){
            steps{
                script{
                    sh 'npm ci'
                }
            }
        }

        stage('parallel'){
            parallel{

                stage('Testing'){
                    when {
                       expression {
                           return !env.GIT_BRANCH?.endsWith('/main')
                       }
                    }
                    steps{
                        script{
                            sh '''
                            npm run test
                            '''
                        }
                    }
                }
                stage('Coverage'){
                     when {
                           expression {
                               return !env.GIT_BRANCH?.endsWith('/main')
                           }
                    }
                    steps{
                        script{
                             sh 'cat package.json'
                            sh 'npm run coverage'
                        }

                    }
                }
            }
        }
        stage('SonarQube'){
                 when {
                       expression {
                           return !env.GIT_BRANCH?.endsWith('/main')
                       }
                }
            steps{
                withSonarQubeEnv("${SONARQUBE_IN_JENKINS}")
                {
                 sh 'npx sonar-scanner -Dsonar.token=$SONAR_AUTH_TOKEN  -Dsonar.host.url=http://sonarqube:9000 -Dsonar.sources=.'

                }
            }
        }


         stage('Build') {

            steps {
                script {
                    def imageTag = env.BUILD_ID
                    def imageName = "anakondik/jenkins-lab12:${imageTag}"
                    def img = docker.build(imageName)
                    echo "Docker image built: ${img.id}"
                    sh  'docker save -o ./target/reports/docker_archive.tar anakondik/jenkins-lab12'
                }
            }
        }
         stage('Archive'){
//              when {
//                    expression {
//                        return env.GIT_BRANCH?.endsWith('/main')
//                    }
//             }
             steps {
                script {
                     echo ' Archiwizacja artefaktów...'
//                      archiveArtifacts artifacts: "${REPORT_DIR}/*.xml", fingerprint: true
                     archiveArtifacts artifacts: "${REPORT_DIR}/*.tar", fingerprint: true
//                      junit "${REPORT_DIR}/*.tar"
                     }
             }
        }


        stage('Push') {
             when {
                   expression {
                       return env.GIT_BRANCH?.endsWith('/main')
                   }
            }
            steps {
                script {
                    def imageTag = env.BUILD_ID
                    def imageName = "anakondik/jenkins-lab12:${imageTag}"
                    docker.withRegistry('', 'docker_credentionals') {
                        def img = docker.image(imageName)
                        img.push()
                        img.push('latest')
                        echo " Docker image pushed: ${imageName}"
                    }
                }
            }
        }

    }
    post {
        always {
            script {
                echo ' Czyszczenie po pipeline...'

                try {
                    sh "docker rmi ${env.IMAGE_NAME} || true"
                } catch (err) {
                    echo "Nie udało się usunąć obrazu lokalnego: ${err}"
                }
                def status = currentBuild.currentResult ?: 'SUCCESS'
                echo status
                writeFile file: 'raport.txt', text: "Build status: ${status}\n"
                archiveArtifacts artifacts: 'raport.txt', fingerprint: true
//                 echo currentBuild.currentResult == 'SUCCESS'
//                     ? ' Pipeline zakończony sukcesem.'
//                     : ' Pipeline zakończony niepowodzeniem.'
            }
        }
    }
}