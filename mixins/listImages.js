import AWS from 'aws-sdk'

AWS.config.update({
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-central-1:e72feb65-e6b4-4cb1-9b41-e37b3e976f66'
  }),
  region: 'eu-central-1'
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: 'gamesnap' }
})

export default {
  methods: {
    listImages () {
      s3.listObjectsV2( (err, data) => {
        if (err) {
          console.log("Error: " , err);
        } else {
          this.$store.dispatch('gallery/initialGallery', data.Contents)
        }
      });
    }
  }
}
