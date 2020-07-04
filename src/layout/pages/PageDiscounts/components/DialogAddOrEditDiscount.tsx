import React, { useState, FunctionComponent } from 'react';

// Misc
import * as discountAPI from '../../../../api/discountAPI';
import moment from 'moment';

// Interface
import { Discount, DiscountInput } from '../../../../interfaces/discount';

// Component
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

interface IDialogAddOrEditDiscountProps {
  discountToEdit: Discount | null, // null: DialogAdd. not null: DialogEdit
  isOpen: boolean,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditDiscount: FunctionComponent<IDialogAddOrEditDiscountProps> = (props) => {
  const [discountInput, setDiscountInput] = useState<DiscountInput>({ name: '', discount: 0, expire: moment().add(1, 'hour').startOf('hour').toISOString() });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onDialogEnter = () => {
    if (!props.discountToEdit) {
      setDiscountInput({ name: '', discount: 0, expire: moment().add(1, 'hour').startOf('hour').toISOString() });
    } else {
      setDiscountInput({ 
        name: props.discountToEdit.name,
        discount: props.discountToEdit.discount,
        expire: props.discountToEdit.expire,
      });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    if (!props.discountToEdit) {
      // Add
      discountAPI.addDiscount(discountInput)
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
      discountAPI.updateDiscount(props.discountToEdit.id, discountInput)
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
      <DialogTitle id="form-dialog-title">{!props.discountToEdit ? `Add Discount` : `Edit Discount: ${props.discountToEdit.name}`}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText>
        <TextField
          required
          id="outlined-full-width"
          label="Discount code (4-6 digits)"
          style={{ margin: 8 }}
          placeholder="DIS001"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={discountInput.name}
          onChange={(event) => {setDiscountInput({...discountInput, name: event.target.value })}}
        />
        <TextField
          required
          id="outlined-full-width"
          label="Discount Percent (%)"
          style={{ margin: 8 }}
          placeholder="50"
          type='number'
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={discountInput.discount}
          onChange={(event) => {setDiscountInput({...discountInput, discount: +event.target.value })}}
        />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            label="Expire At"
            inputVariant="outlined"
            style={{ margin: 8 }}
            fullWidth
            minDate={moment()}
            margin="normal"
            minutesStep={5}
            value={discountInput.expire}
            onChange={(date) => {
              if (date) {
                setDiscountInput({...discountInput, expire: date.toISOString()});
              }
            }}
          />
        </MuiPickersUtilsProvider>
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

export default DialogAddOrEditDiscount;