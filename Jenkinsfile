pipeline{
    agent any
//     agent{
//         docker{
//             image 'anakondik/custom-jenkins-build-agent:1.0.1' args '-u root'
//         }
//     }
    stages{
        stage('checkout'){
           steps{
                  git url: 'https://github.com/s27297/CI_CD_lab12', branch: 'main'
           }
        }
        stage('parallel'){
            parallel{
                stage('Testing'){
                    sh '''
                    npm test
                    '''
                }
                stage('Coverage')
            }
        }
        stage('Archive'){
             steps {
                script {
                    echo '🗄 Archiwizacja artefaktów...'
                    archiveArtifacts artifacts: "app-${BUILD_ID}.jar,${REPORT_DIR}/*.xml", fingerprint: true
                }
             }
        }
        stage('Build'){
            script{
                def imageTag = env.BUILD_ID
                def fullImageName = "anakondik/Jenkins-lab11:${imageTag}"
                def registryCredentialId = 'docker-hub'
                def registryUrl = ''
                docker.withRegistry(registryUrl, registryCredentialId) {
                    def customImage = docker.build("anakondik/Jenkins-lab1:${env.BUILD_ID}")
                    echo "INFO: Obraz Docker zbudowany pomyślnie: ${customImage.id}"
                    stash customImage
                }
            }
        }
        stage('Push'){
            steps{
                unstash customImage
                customImage.push()
                customImage.push('latest')
                echo "INFO: Obraz został pomyślnie wypchnięty."
            }
        }
        stage('Post'){
            
        }

    }
}