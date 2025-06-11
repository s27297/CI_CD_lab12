pipeline{
     agent {
        docker {
            image 'node:18'  // or another Node.js version you need
        }
     }
//     agent{
//         docker{
//             image 'anakondik/custom-jenkins-build-agent:1.0.1' args '-u root'
//         }
//     }
    environment {
//         API_KEY     = credentials('api-key-id')
        TARGET_DIR  = 'lib/*'
        CLASS_DIR   = 'target/classes'
        REPORT_DIR  = 'target/reports'
        TEST_DIR    = 'target/test-classes'
    }
    stages{
        stage('checkout'){
           steps{
                  git url: 'https://github.com/s27297/CI_CD_lab12', branch: 'main'
           }
        }
        stage('parallel'){
            parallel{
                stage('Testing'){
                    steps{
                        script{
                            sh '''
                            npm test
                            '''
                        }
                    }
                }
                stage('Coverage'){
                    steps{
                       sh 'npm run coverage'

                    }
                }
            }
        }
        stage('Archive'){
             steps {
                script {
                    echo '🗄 Archiwizacja artefaktów...'
                    ls
//                     archiveArtifacts artifacts: "app-${BUILD_ID}.jar,${REPORT_DIR}/*.xml", fingerprint: true

                    archiveArtifacts artifacts: "${REPORT_DIR}/*.xml", fingerprint: true}
             }
        }
        stage('Build'){
            steps{
                script{
                    def imageTag = env.BUILD_ID
                    def imageName = "anakondik/Jenkins-lab12:${imageTag}"
                    docker.withRegistry('', 'docker-hub') {
                        def img = docker.build(imageName)
                        echo "INFO: Docker image built: ${img.id}"
                    }
                }
            }
        }
        stage('Push') {
            steps {
                script {
                    def imageTag = env.BUILD_ID
                    def imageName = "anakondik/Jenkins-lab12:${imageTag}"
                    docker.withRegistry('', 'docker-hub') {
                        def img = docker.image(imageName)
                        img.push()
                        img.push('latest')
                        echo "INFO: Docker image pushed."
                    }
                }
            }
        }
    }
    post{
        always{
            echo "Post"
        }
    }
}