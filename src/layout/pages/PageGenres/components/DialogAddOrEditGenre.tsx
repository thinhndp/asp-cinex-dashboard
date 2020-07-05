import React, { useState, FunctionComponent } from 'react';

// Misc
import * as genreAPI from '../../../../api/genreAPI';
import * as Constants from '../../../../utils/constants';

// Interface
import { Genre, GenreInput, GenreValidation } from '../../../../interfaces/genre';

// Component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

interface IDialogAddOrEditGenreProps {
  genreToEdit: Genre | null, // null: DialogAdd. not null: DialogEdit
  isOpen: boolean,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditGenre: FunctionComponent<IDialogAddOrEditGenreProps> = (props) => {
  const [genreInput, setGenreInput] = useState<GenreInput>({ name: '' });
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [errors, setErrors] = useState<GenreValidation>({ name: '' });
  const [requestError, setRequestError] = useState('');

  const onDialogEnter = () => {
    if (!props.genreToEdit) {
      setGenreInput({ name: '' });
    } else {
      setGenreInput({ name: props.genreToEdit.name });
	}
	setErrors({ name: '' });
	setRequestError('');
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const validateInput = () : boolean => {
	  let validationResult: GenreValidation = { name: '' };
	  let isOK = true;
	  if (genreInput.name.length === 0) {
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
		if (!props.genreToEdit) {
		  // Add Genre
		  genreAPI.addGenre(genreInput)
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
		  // Update Room
		  genreAPI.updateGenre(props.genreToEdit.id, genreInput)
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
      <DialogTitle id="form-dialog-title">{!props.genreToEdit ? `Add Genre` : `Edit Genre: ${props.genreToEdit.name}`}</DialogTitle>
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
			label="Genre name"
			style={{ margin: 8 }}
			placeholder="Sci-Fi"
			fullWidth
			margin="normal"
			InputLabelProps={{ shrink: true, }}
			variant="outlined"
			value={genreInput.name}
			onChange={(event) => {setGenreInput({...genreInput, name: event.target.value })}}
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

export default DialogAddOrEditGenre;