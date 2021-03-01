// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js');


/* Initialize Firebase */
firebase.initializeApp({
  /* Fill in the following values based on your config. */
    apiKey: "AIzaSyDio_qcVsQmKJLg1IvzTnqLecm1jAwohU8",
    authDomain: "locals2.firebaseapp.com",
    projectId: "locals2",
    storageBucket: "locals2.appspot.com",
    messagingSenderId: "673684414860",
    appId: "1:673684414860:web:7f2a9cf4839e305d87f6a9",
    measurementId: "G-DXYBR0NGRC"
});

firebase.firestore().settings({
  timestampsInSnapshots: true
});

/* Define firebase refs */
const messagesRef = firebase.firestore().collection("messages");

/* Define DOM elements */
const messageInputDOM = document.getElementById("messageInput");
const soundInputDOM = document.getElementById("soundInput");
const soundPickerDOM = document.getElementById("submit");
const namePickerDOM= document.getElementById("namePicker");
const messagesDOM = document.getElementById("messages");

/* Define global variables */
const sessionId = btoa(Math.random()).substring(0, 16);
let userName;

/* Define helper functions */
const scrollToBottom = (element) => {
  if (element) element.scrollTop = element.scrollHeight;
};

const createParagraph = (content) => {
  const newParagraph = document.createElement("p");

  if (content) {
    const contentEl = document.createTextNode(content);
    newParagraph.appendChild(contentEl);
  }

  return newParagraph;
};

const sendMessage = (message) => {
  messagesRef.add({
    message,
    time: firebase.firestore.Timestamp.now(),
    session: sessionId,
    name: userName || "Anonymous",
  });
};

const sendImage = (image) => {
  messagesRef.add({
    image,
    time: firebase.firestore.Timestamp.now(),
    session: sessionId,
    name: userName || "Anonymous",
  });
};

/* Setup message listener */
messagesRef.orderBy("time").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const { session, name, image, message, time } = change.doc.data();

      const messageEl = document.createElement("div");
      messageEl.className = `message${session === sessionId ? " own" : ""}`;

      const nameEl = createParagraph(name);
      nameEl.className = "name";
      messageEl.appendChild(nameEl);

      const messageContentEl = document.createElement("div");
      messageContentEl.className = "messageContent";

      if (change.doc.data().image !== undefined) {
        const imageEl = document.createElement("img");
        imageEl.className = "image";
        imageEl.setAttribute("src", image);
        imageEl.setAttribute("height", "256px");
        messageContentEl.appendChild(imageEl);
      }

      if (change.doc.data().message !== undefined) {
        const msgTextEl = createParagraph(message);
        messageContentEl.appendChild(msgTextEl);
      }

      messageEl.appendChild(messageContentEl);

      var timestampEl = createParagraph(time.toDate());
      timestampEl.className = "timestamp";
      messageEl.appendChild(timestampEl);
      
      messagesDOM.appendChild(messageEl);
    }
  });

  scrollToBottom(messagesDOM);
});

/* Setup event listeners */
namePickerDOM.addEventListener("click", () => {
  userName = prompt("What's your name?").substring(0, 16);
  namePickerDOM.parentNode.removeChild(namePickerDOM);
});


messageInputDOM.addEventListener("keydown", (event) => {
  if (event.which === 13 || event.keyCode === 13) {
    sendMessage(messageInputDOM.value);
      messageInputDOM.value = "";
      sendMessage(soundInputDOM.value);
      soundInputDOM.value = "";
  }
});
const messaging = firebase.messaging();
// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken({ vapidKey: "BEa6JegOxPWXtaslwY73PHf8OWJaQ7UBLgyqs32jB3K9ccMud4_OO53zNQ6fl77_w0WIrVD9jFbqyNKTN6tBnII" }).then((currentToken) => {
    if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
    } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
});
messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
});
function onBackgroundMessage() {
    const messaging = firebase.messaging();

    // [START messaging_on_background_message]
    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
            body: 'Background Message body.',
            icon: '/firebase-logo.png'
        };

        self.registration.showNotification(notificationTitle,
            notificationOptions);
    });
  // [END messaging_on_background_message]




/* Setup Bitmoji Kit Web here */