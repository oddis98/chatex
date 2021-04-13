import React, { useState, useEffect, useRef } from "react";

const io = require("socket.io-client");

const MessageBoard = (props) => {
  const [conversation, setConversation] = useState([
    {
      "It's so quiet in here...": ["", "", "#ffffff"],
    },
    {
      "Try adding a friend by clicking the '+' button under 'Friends', or invite an existing friend by clicking on their respective e-mail!": [
        "",
        "",
        "#ffffff",
      ],
    },
    {
      "You may also remove a friend by clicking the 'x' button next to their e-mail.": [
        "",
        "",
        "#ffffff",
      ],
    },
  ]);
  const [scrollText, setScrollText] = useState("Scroll to Top \u2191");

  const dummy = useRef();
  const dummyTop = useRef();

  useEffect(() => {
    const updateMessageBoard = () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + props.auth,
        },
      };
      fetch("https://chatex2.herokuapp.com/room/" + props.room, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          let text = [];
          let i;

          try {
            for (i = 0; i < data.conversation.length; i++) {
              let dic = {};
              let liste = [];
              let placement;
              let color;
              liste.push(data.conversation[i].postedByUser.email);

              if (data.conversation[i].postedByUser.email === props.email) {
                placement = "right";
                color = "#94e4f5";
              } else {
                placement = "";
                color = "#ffffff";
              }
              liste.push(placement);
              liste.push(color);
              dic[data.conversation[i].message.messageText] = liste;
              text.push(dic);
            }
            if (conversation !== text) {
              setConversation(text);
            }
            dummy.current.scrollIntoView({ behavior: "smooth" });
          } catch (error) {
            console.log(error);
          }
        });
    };

    if (props.room) {
      updateMessageBoard();

      var socket = io.connect("https://chatex2.herokuapp.com/", {
        reconnect: true,
      });

      socket.on("message", (text) => {
        console.log(text.message);
        updateMessageBoard();
      });
    }

    return () => {
      if (props.room) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.room, props.auth, props.email]);

  const handleTop = () => {
    const box = document.querySelector("#dummyTop");
    const rect = box.getBoundingClientRect();
    if (rect.top < 0) {
      dummyTop.current.scrollIntoView({ behavior: "smooth" });
      setScrollText("Scroll to Current \u2193");
    } else {
      dummy.current.scrollIntoView({ behavior: "smooth" });
      setScrollText("Scroll to Top \u2191");
    }
  };

  const regex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

  return (
    <div
      id="paperField"
      className="innerMessage"
      style={{
        maxHeight: "calc(100vh - 12rem)",
        overflow: "auto",
        backgroundColor: "",
      }}
    >
      <div id="textBox">
        <div id="dummyTop" ref={dummyTop}></div>
        <ul>
          {conversation.map((value, index) => {
            const text = Object.keys(value);
            const align = Object.values(value)[0][1];
            const color = Object.values(value)[0][2];
            const mail = Object.values(value)[0][0];
            return (
              <li
                style={{
                  margin: "0.5rem",
                  listStyle: "none",
                  textAlign: align,
                }}
                key={index}
              >
                <div
                  style={{
                    borderRadius: "1rem",
                    backgroundColor: color,
                    display: "inline-block",
                    padding: "0.5rem",
                    textAlign: "left",
                    whiteSpace: "pre-line",
                  }}
                >
                  {regex.test(text) ? (
                    <a
                      href={text[0].includes("http") ? text : "//" + text}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#2d2d2d",
                      }}
                    >
                      {text}
                    </a>
                  ) : (
                    text
                  )}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    textAlign: align,
                  }}
                >
                  {mail}
                </div>
              </li>
            );
          })}
        </ul>
        <div>
          <p
            style={{
              position: "fixed",
              right: 50,
              bottom: "6rem",
              color: "#ffffff",
              cursor: "pointer",
            }}
            onClick={handleTop}
          >
            {scrollText}
          </p>
        </div>
        <div ref={dummy}></div>
      </div>
    </div>
  );
};

export default MessageBoard;
