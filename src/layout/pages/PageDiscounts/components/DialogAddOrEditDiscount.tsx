import React, { useState, FunctionComponent } from 'react';

// Misc
import * as discountAPI from '../../../../api/discountAPI';
import * as Constants from '../../../../utils/constants';
import moment from 'moment';

// Interface
import { Discount, DiscountInput, DiscountValidation } from '../../../../interfaces/discount';

// Component
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
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
  const [discountInput, setDiscountInput] = useState<DiscountInput>({ code: '', discountAmount: 0, expiredDate: moment().add(1, 'hour').startOf('hour').toISOString(), isActive: true });
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [errors, setErrors] = useState<DiscountValidation>({ code: '', discountAmount: '' });
  const [requestError, setRequestError] = useState('');

  const onDialogEnter = () => {
    if (!props.discountToEdit) {
      setDiscountInput({ code: '', discountAmount: 0, expiredDate: moment().add(1, 'hour').startOf('hour').toISOString(), isActive: true });
    } else {
      setDiscountInput({ 
        code: props.discountToEdit.code,
        discountAmount: props.discountToEdit.discountAmount,
        expiredDate: props.discountToEdit.expiredDate,
        isActive: props.discountToEdit.isActive,
      });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }
  const validateInput = () : boolean => {
    let validationResult: DiscountValidation = { code: '', discountAmount: '' };
    let isOK = true;
    if (discountInput.code.length === 0) {
      validationResult.code = Constants.ERROR_MSG_FIELD_REQUIRED;
      isOK = false;
    }
    if (discountInput.discountAmount <= 0) {
      validationResult.discountAmount = Constants.ERROR_MSG_FIELD_NOT_POSITIVE_NUMBER;
      isOK = false;
    }
    setErrors({ ...validationResult });
    return isOK;
  }

  const onDialogSave = () => {
    const isOK = validateInput();
    if (isOK) {
      setIsLoadingSave(true);
      if (!props.discountToEdit) {
        // Add
        discountAPI.addPromotion(discountInput)
          .then(response => {
            setIsLoadingSave(false);
            console.log(response);
            props.onSave();
          })
          .catch(err => {
            setIsLoadingSave(false);
            setRequestError(err.toString());
          })
      } else {
        // Update
        discountAPI.updatePromotion(props.discountToEdit.id, discountInput)
          .then(response => {
            setIsLoadingSave(false);
            console.log(response);
            props.onSave();
          })
          .catch(err => {
            setIsLoadingSave(false);
            setRequestError(err.toString());
          })
      }
    }
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()}>
      <DialogTitle id="form-dialog-title">{!props.discountToEdit ? `Add Discount` : `Edit Discount: ${props.discountToEdit.code}`}</DialogTitle>
      <DialogContent dividers>
        {
          requestError.length > 0
            ? <DialogContentText style={{ color: "red" }}>
                {requestError}
              </DialogContentText>
            : <DialogContentText>
                Please fill those fields below to continue.
              </DialogContentText>
        }
        <TextField
          error={errors.code.length > 0}
          helperText={errors.code}
          required
          id="outlined-full-width"
          label="Discount code"
          style={{ margin: 8 }}
          placeholder="DIS001"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={discountInput.code}
          onChange={(event) => {setDiscountInput({...discountInput, code: event.target.value })}}
        />
        <TextField
          error={errors.discountAmount.length > 0}
          helperText={errors.discountAmount}
          required
          id="outlined-full-width"
          label="Discount Amount ($)"
          style={{ margin: 8 }}
          placeholder="50"
          type='number'
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={discountInput.discountAmount}
          onChange={(event) => {setDiscountInput({...discountInput, discountAmount: +event.target.value })}}
        />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            label="Expire At"
            inputVariant="outlined"
            style={{ margin: 8 }}
            fullWidth
            minDate={moment()}
            margin="normal"
            value={discountInput.expiredDate}
            onChange={(date) => {
              if (date) {
                setDiscountInput({...discountInput, expiredDate: date.toISOString()});
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