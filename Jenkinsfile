pipeline{
     agent {
        docker {
            image 'node:18'  // or another Node.js version you need
        }
     }

    environment {
//         API_KEY     = credentials('api-key-id')
        REPORT_DIR  = 'target/reports'
    }
    stages{
        stage('checkout'){
           steps{
                  git url: 'https://github.com/s27297/CI_CD_lab12', branch: 'main'
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
                    steps{
                        script{
                            sh '''
                            npm run test
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
                     archiveArtifacts artifacts: "${REPORT_DIR}/*.xml", fingerprint: true
                     junit "${REPORT_DIR}/*.xml"
                     }
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