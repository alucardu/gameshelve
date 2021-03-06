import AWS from 'aws-sdk'

AWS.config.update({
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.IDENTITY_POOL_ID
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
          console.log("ERROR: " , err);
        } else {
          this.$store.dispatch('gallery/initialGallery', data.Contents)
        }
      });
    }
  }
}
