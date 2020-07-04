import React, { useState, FunctionComponent } from 'react';

// Misc
import * as rateAPI from '../../../../api/rateAPI';

// Interface
import { Rate, RateInput } from '../../../../interfaces/rate';

// Component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

interface IDialogAddOrEditRateProps {
  rateToEdit: Rate | null, // null: DialogAdd. not null: DialogEdit
  isOpen: boolean,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditRate: FunctionComponent<IDialogAddOrEditRateProps> = (props) => {
  const [rateInput, setRateInput] = useState<RateInput>({ name: '', minAge: 0 });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onDialogEnter = () => {
    if (!props.rateToEdit) {
      setRateInput({ name: '', minAge: 0 });
    } else {
      setRateInput({ name: props.rateToEdit.name, minAge: props.rateToEdit.minAge });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    if (!props.rateToEdit) {
      // Add
      rateAPI.addRate(rateInput)
        .then(response => {
          setIsLoadingSave(false);
          console.log(response);
          props.onSave();
        })
        .catch(err => {
          setIsLoadingSave(false);
          console.log(err);
        })
    } else {
      // Update
      rateAPI.updateRate(props.rateToEdit.id, rateInput)
        .then(response => {
          setIsLoadingSave(false);
          console.log(response);
          props.onSave();
        })
        .catch(err => {
          setIsLoadingSave(false);
          console.log(err);
        })
    }
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()}>
      <DialogTitle id="form-dialog-title">{!props.rateToEdit ? `Add Rate` : `Edit Rate: ${props.rateToEdit.name}`}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText>
        <TextField
          required
          id="outlined-full-width"
          label="Rate name"
          style={{ margin: 8 }}
          placeholder="R-18"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={rateInput.name}
          onChange={(event) => {setRateInput({...rateInput, name: event.target.value })}}
        />
        <TextField
          required
          id="outlined-full-width"
          label="Minimum age allowed"
          style={{ margin: 8 }}
          placeholder="18"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={rateInput.minAge}
          onChange={(event) => {setRateInput({...rateInput, minAge: +event.target.value })}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onDialogClose()} color="primary">
          Cancel
        </Button>
        <div style={{position: 'relative'}}>
          {/* Extra <div> is for loading */}
          <Button onClick={() => onDialogSave()} color="primary" variant="contained" disabled={isLoadingSave}>
            Save
          </Button>
          {isLoadingSave ? <CircularProgress size={24} className="circular-center-size-24px" /> : null}
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default DialogAddOrEditRate;