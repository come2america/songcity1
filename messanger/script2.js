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
var database = firebase.database();

messageInputDOM.addEventListener("keydown", (event) => {
    event.preventDefault();
    street = $("#street").val().trim().toLowerCase();
    city = $("#city").val().trim().toLowerCase();
    state = $("#state").val().trim().toLowerCase();


    var ref = firebase.database().ref();

    ref.orderByChild("userstreet").equalTo(street).on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            console.log(childSnapshot)
            var value = childSnapshot.val();
            assigntrack = value.usertrackid;
        });

        if (snapshot.val()) {
            console.log("if statement executed");

            database.ref().push({
                userstreet: street,
                usercity: city,
                userstate: state,
                message: messageInputDOM,
                sound: soundInputDOM,
                name: namePickerDOM,

            })
        }
    }
});

/* Setup Bitmoji Kit Web here */