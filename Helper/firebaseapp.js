const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  type: "service_account",
  project_id: "abtechzone-b5f14",
  private_key_id: "0cafb7e5ed35d5ec5f3a9482f1bffb0f22d1a9cb",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC+pf+vIfTFFCnp\ns5c2zkQZ3DR5m0VxuWxdbLKgfOX5rkywq6U3pzyA5m7wFUueXyWxJhAHNxQ7nq0C\nEtmf1ggDQltatAg55LJyqzoaZE1EH8MkUHc6s54c8qNhG43naOdY6X9WXCjV0mnc\nmb6ZEoJZqT0P06sE5kTsfXjvjsJLZby3QVTzTJwUot8UFfa9CsrcGQ6nxtHixsAT\n00kiIrtkhUfAD1oICLk0HLG1GFZbkLckBKLWsVv04hfI99rMb1+mrsUtOqKveNdS\n4syaYKPWp51stS/ip3i1/TxIZGDipI8D3TQll5y7TSspYqQC/YhQJMRqEpK4CNih\nhs5KngZxAgMBAAECggEADpd18lmO+maIrrJoKHGxFKmd+pC/x+yBNsVTBqWIlIua\nowsAIjpSjysT4pw+pWhy4hQfte2pRsbmRvpaXblr85PomhCdcJDod45TbCGxKD2m\nGelutrd4qo6Hoq8RNVz6F/wHGv0CwxrPr2q1A9I+1830Nnnk5QMa017nGq66gDqv\nXP70t+TYukJi8PdIY9xdRZF4nyGoogWBjm6Q0L21C5Mw6YIxFSAXTiyQjAhw8Bll\n1+XMKGd3g+UnvpoxCcQbOhzXHbtRmtLj7hyCyoXYYrOyzvpJeqn1qu+W7E9TicXp\nik2IAGiSieauEAEb0T7OpcpdkKIAxFhZPoY5UL0+gQKBgQDfnZi1AzJWYC94V2+s\n4QvoFrEcGgIipuYl03RNheH9xpudac6Azq+jj/7e3O2z0X/zMeqYbIJKr+EST0Eh\n9/89/VB9doGjfgtNeltxgVSO5HyyqZ5URtfT6LxUTJsFULlO1277NxcfdohPHkys\nIsQACeLcQPlmpjtRf+RRYY1B3QKBgQDaQipf5P+zlNpvI9WU0y3IIicfBupCcKRm\nmwGFpiCZNpo6OYOtKcXfbTUpX0Lg+wsngNGQ1cnQlmygBuJtgHms+wYGqfD3h8G1\n4/A9wAG53lxyllNDD//OMqZ59B5KXZVXBuo52ndbQQg61aREg9EDwLGbqBmCTcPa\nEo4U2TcvpQKBgQC45wixjK4f7DL0cGBgdEozJChZE0x2uMkPuBSwUad3/7UHacke\ni0mClvvp7ocDLJV/U+QnG3p1JY+XYz95RiahbIgU5lv2A7B25VkdtxJjgZ124niQ\nOXAXwpePoTSCJajE/7C+O2R8WLgHrAc8QxcM7R/Qfk17yrK8BmOVw3NZZQKBgAmU\n0AFnryX2CeTJIO4omyDnBuqgxhXmlgD/GwD/+vxe3kRiE/q9E7esNqI7UVdJDgNM\n72Y5TGPAxsH7q2L9OdozJt+SBEcJiaJvgDNlw22ialKJcNxHzoYByTcfVVkUZKLu\nZcfmZEj4QOE8UbrEQp+0jNd1eLE0sr1XBS+7HWYVAoGBAKDu/LUACH06T5Ffzeut\nDFtoJDHhY4RvHw21nyyXVaILl89BuIWnOZb9DDz1RaE/3yK4sMr73AOQgAjSYOEL\noiJsF1hoRS8619X+cz/Rf0XbIlh+gN0wPMDoHnwiioxzyzt1/uUGzxjpcrUl4YGh\n7H4I2XAmK8G35b82bgvgXbeI\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fao9z@abtechzone-b5f14.iam.gserviceaccount.com",
  client_id: "111746261335407660110",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fao9z%40abtechzone-b5f14.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
  storageBucket: "gs://abtechzone-b5f14.appspot.com",
};

const firebaseApp = initializeApp(firebaseConfig);

module.exports = { firebaseApp };
