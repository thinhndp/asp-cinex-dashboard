import React, { useState, FunctionComponent } from 'react';

// Misc
import * as actorAPI from '../../../../api/actorAPI';
import * as Constants from '../../../../utils/constants';

// Interface
import { Actor, ActorInput, ActorValidation } from '../../../../interfaces/actor';

// Component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

interface IDialogAddOrEditActorProps {
  actorToEdit: Actor | null, // null: DialogAdd. not null: DialogEdit
  isOpen: boolean,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditActor: FunctionComponent<IDialogAddOrEditActorProps> = (props) => {
  const [actorInput, setActorInput] = useState<ActorInput>({ name: '', avatar: '' });
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [errors, setErrors] = useState<ActorValidation>({ name: '', avatar: '' });
  const [requestError, setRequestError] = useState('');

  const onDialogEnter = () => {
    if (!props.actorToEdit) {
      setActorInput({ name: '', avatar: '' });
    } else {
      setActorInput({ name: props.actorToEdit.name, avatar: props.actorToEdit.avatar });
	}
	setErrors({ name: '', avatar: '' });
	setRequestError('');
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const validateInput = () : boolean => {
	let validationResult: ActorValidation = { name: '', avatar: '' };
	let isOK = true;
	if (actorInput.name.length === 0) {
		validationResult.name = Constants.ERROR_MSG_FIELD_REQUIRED;
		isOK = false;
	}
	setErrors({ ...validationResult });
	return isOK;
}

  const onDialogSave = () => {
	const isOK = validateInput();
	if (isOK) {
		setIsLoadingSave(true);
		if (!props.actorToEdit) {
		  // Add
		  actorAPI.addActor(actorInput)
			.then(response => {
			  setIsLoadingSave(false);
			  console.log(response);
			  props.onSave();
			})
			.catch(err => {
			  setIsLoadingSave(false);
			  setRequestError(err.toString());
			  console.log(err);
			})
		} else {
		  // Update
		  actorAPI.updateActor(props.actorToEdit.id, actorInput)
			.then(response => {
			  setIsLoadingSave(false);
			  console.log(response);
			  props.onSave();
			})
			.catch(err => {
			  setIsLoadingSave(false);
			  setRequestError(err.toString());
			  console.log(err);
			})
		}
	}
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()}>
      <DialogTitle id="form-dialog-title">{!props.actorToEdit ? `Add Actor` : `Edit Actor: ${props.actorToEdit.name}`}</DialogTitle>
      <DialogContent dividers>
	  	{
			requestError.length > 0
			? (	<DialogContentText style={{ color: "red" }}>
					{requestError}
		  		</DialogContentText>)
			: (	<DialogContentText>
					Please fill those fields below to continue.
				</DialogContentText>)
		}
        <TextField
					error={errors.name.length > 0}
					helperText={errors.name}
					required
					id="outlined-full-width"
					label="Actor name"
					style={{ margin: 8 }}
					placeholder="Tom Holland, Samuel L. Jackson, ..."
					fullWidth
					margin="normal"
					InputLabelProps={{ shrink: true, }}
					variant="outlined"
					value={actorInput.name}
					onChange={(event) => {setActorInput({...actorInput, name: event.target.value })}}
        />
        <TextField
					error={errors.avatar.length > 0}
					helperText={errors.avatar}
					id="outlined-full-width"
					label="Avatar"
					style={{ margin: 8 }}
					placeholder="https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg"
					fullWidth
					margin="normal"
					InputLabelProps={{ shrink: true, }}
					variant="outlined"
					value={actorInput.avatar}
					onChange={(event) => {setActorInput({...actorInput, avatar: event.target.value })}}
        />
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<img src={actorInput.avatar ? actorInput.avatar : 'https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg'} style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: '50%' }} />
				</div>
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

export default DialogAddOrEditActor;