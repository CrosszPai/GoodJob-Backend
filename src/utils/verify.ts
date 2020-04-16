import admin from '../adminFirebase'

const verify = async (idToken: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return decodedToken.uid;
  } catch (err) {
    console.log(err);
    return null
  }
}
export default verify