import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import PersonAddRoundedIcon from "@material-ui/icons/PersonAddRounded";

const SimpleDialogPrep = (props) => {
  const { onClose, open, getFriends } = props;
  const [friend, setFriend] = useState("");

  const addFriend = () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          friend: friend.target.value.toLowerCase(),
        }),
      };
      fetch("https://chatex2.herokuapp.com/users/addFriend", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            return alert("No email found");
          }
          getFriends();
        });
    } catch (error) {
      console.log("Please type in a name");
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleClick = () => {
    addFriend();
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="addFriend"
      open={open}
      id="outerDialog"
    >
      <div
        style={{
          background: "#2d2d2d",
          borderRadius: "1rem",
          padding: "1rem",
          width: "20rem",
        }}
      >
        <DialogTitle id="addFriend" style={{}}>
          Add a Friend!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <input
              className="friendInput"
              onChange={setFriend}
              placeholder="Write in your friend's E-mail!"
            ></input>
          </DialogContentText>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleClick}
              style={{ backgroundColor: "#8eff8b" }}
            >
              Add friend
            </Button>
          </DialogActions>
        </DialogContent>
      </div>
    </Dialog>
  );
};

const SimpleDialog = (props) => {
  const [open, setOpen] = useState(false);
  const getFriends = props.getFriends;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div
      style={{
        width: "3rem",
        height: "3rem",
      }}
    >
      <IconButton
        onClick={handleOpen}
        style={{
          color: "#ffffff",
        }}
      >
        <PersonAddRoundedIcon />
      </IconButton>
      <SimpleDialogPrep
        getFriends={getFriends}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};

export default SimpleDialog;
