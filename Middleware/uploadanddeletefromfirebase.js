const { firebaseApp } = require("../Helper/firebaseapp");
const {
  ref,
  getStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const uuid = require("uuid");

const uploadfileonfirebase = async (file, type) => {
  const FirebaseStorage = getStorage(firebaseApp);

  const imageByte = Uint8Array.from(file[0]?.buffer);

  storageRef = ref(FirebaseStorage, type);

  await uploadBytes(storageRef, imageByte);

  url = await getDownloadURL(storageRef);

  return url;
};

const deletefilefromfirebase = async (type) => {
  const FirebaseStorage = getStorage(firebaseApp);

  const storageRef = ref(FirebaseStorage, type);

  await deleteObject(storageRef);

  return true;
};

module.exports = { deletefilefromfirebase, uploadfileonfirebase };
