/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from "react";
import { Grid, IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SimpleDialog from "./Dialog.js";

import SendRoundedIcon from "@material-ui/icons/SendRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";

import MessageBoard from "./MessageBoard.js";

const UserPage = () => {
  const [email, setEmail] = useState("");
  const [auth, setAuth] = useState("");
  const [userId, setUserId] = useState("");
  const [room, setRoom] = useState("");
  const [msg, setMsg] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [friendSend, setFriendSend] = useState("");
  const history = useHistory();

  const inviteFriend = (values) => {
    try {
      fetch(
        "https://chatex2.herokuapp.com/users/email/" + values.target.textContent
      )
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            return;
          }
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + auth,
            },
            body: JSON.stringify({
              userIds: [userId, data.user._id],
              type: "consumer-to-consumer",
            }),
          };
          fetch("https://chatex2.herokuapp.com/room/initiate", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              setRoom(data.chatRoom.chatRoomId);
              setFriendSend(values.target.textContent);
            });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = () => {
    sendMessage();

    const msgBox = document.getElementById("msgBox");
    msgBox.value = "";
  };

  const sendMessage = () => {
    try {
      const postMsg = msg.target.value;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth,
        },
        body: JSON.stringify({
          messageText: postMsg,
        }),
      };
      fetch(
        "https://chatex2.herokuapp.com/room/" + room + "/message",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            return;
          }
        });
    } catch {
      console.log("Not connected");
    }
  };

  const logout = () => {
    fetch("https://chatex2.herokuapp.com/logout")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          history.push("/chatex_client");
        }
      });
  };

  useEffect(() => {
    const getSession = () => {
      fetch("https://chatex2.herokuapp.com/login")
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            history.push("/chatex_client");
          } else {
            setEmail(data.email);
            setAuth(data.auth);
            setUserId(data.id);
          }
        });
    };
    const setEnter = () => {
      var inp = document.getElementById("msgBox");
      inp.addEventListener("keyup", function (event) {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
          event.preventDefault();
          document.getElementById("sendMessage").click();
        }
      });
    };

    getSession();
    setEnter();
    getFriends();

    return () => {};
  }, [history]);

  const getFriends = () => {
    try {
      fetch("https://chatex2.herokuapp.com/users/friends/allFriends")
        .then((response) => response.json())
        .then((data) => {
          var liste = [];
          if (data.user) {
            for (var i = 0; i < data.user.friendList.length; i++) {
              liste.push(data.user.friendList[i]);
            }
            setFriendList(liste);
          }
          return;
        });
    } catch (error) {
      console.log("Friendlist empty");
    }
  };

  const removeFriend = (values) => {
    const friendText =
      values.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.textContent;
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friend: friendText,
        }),
      };
      fetch("https://chatex2.herokuapp.com/users/removeFriend", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          getFriends();
        });
    } catch (error) {
      console.log("oh no");
    }
  };

  return (
    <Grid container className="main">
      <Grid
        item
        className="info"
        style={{
          borderRight: "2px solid #3a3a3a",
        }}
      >
        <div className="infoDiv">
          <h2 className="infoHeader">ChatEx</h2>
          <h4
            style={{
              color: "#ffffff",
              fontSize: "1rem",
              padding: "1rem",
            }}
          >
            Friends:
          </h4>
          <SimpleDialog getFriends={getFriends} />
          <div
            id="friendList"
            style={{
              maxHeight: "40vh",
              overflow: "auto",
              width: "100%",
            }}
          >
            <ul
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {friendList.map((value, index) => {
                return (
                  <li
                    style={{
                      listStyle: "none",
                      textAlign: "left",
                      margin: "0.5rem 0.5rem",
                      width: "100%",
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        backgroundColor: "#2f2f2f",
                        border: "1px solid black",
                        borderRadius: "1rem",
                        padding: "0.5rem",
                        color: "#fff",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <div
                        onClick={inviteFriend}
                        style={{
                          cursor: "pointer",
                          flexGrow: "1",
                        }}
                      >
                        {value}
                      </div>

                      <div style={{}} onClick={removeFriend}>
                        <IconButton
                          style={{
                            width: "1rem",
                            height: "1rem",
                            paddingLeft: "1rem",
                            color: "#ffffff",
                          }}
                        >
                          <ClearRoundedIcon />
                        </IconButton>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <IconButton onClick={logout} id="logout">
            <ExitToAppRoundedIcon />
          </IconButton>
        </div>
      </Grid>
      <Grid item className="messageBoard">
        <MessageBoard
          auth={auth}
          room={room}
          email={email}
          friend={friendSend}
        />
        <div className="button">
          <textarea
            id="msgBox"
            className="messageInput"
            onChange={setMsg}
            placeholder="Write something cool!"
          ></textarea>
          <IconButton id="sendMessage" variant="contained" onClick={handleSend}>
            <SendRoundedIcon />
          </IconButton>
        </div>
      </Grid>
    </Grid>
  );
};

export default UserPage;
