import admin from '../adminFirebase'

const verify = async (idToken: string) => {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
};
export default verify
