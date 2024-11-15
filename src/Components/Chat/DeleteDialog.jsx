import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";

import DeleteIcon from "@mui/icons-material/Delete";

// Styling the delete button to be red
const DeleteButton = styled(Button)({
  backgroundColor: "#d32f2f",
  color: "white",
  "&:hover": {
    backgroundColor: "#b71c1c",
  },
});

export default function DeleteDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("deleteForMe");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDelete = () => {
    console.log(`Selected option: ${selectedOption} index : ${props.index}`);
    props.deleteMessage(selectedOption,props.index);

    // Add your delete logic here based on selectedOption
    setOpen(false);
  };

  return (
    <React.Fragment>
      <DeleteIcon onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete message?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can delete messages for everyone or just for yourself.
          </DialogContentText>
          <RadioGroup
            aria-label="delete-options"
            name="delete-options"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <FormControlLabel
              value="deleteForMe"
              control={<Radio />}
              label="Delete for me"
            />
            {(props.delForEveryone && !props.deleted) && <FormControlLabel
              value="deleteForEveryone"
              control={<Radio />}
              label="Delete for everyone"
            />}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
