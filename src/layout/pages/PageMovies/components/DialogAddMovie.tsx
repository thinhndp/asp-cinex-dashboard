import React, { useState, FunctionComponent } from 'react';

// Misc
import * as movieAPI from '../../../../api/movieAPI';
import moment from 'moment';
import * as Constants from '../../../../utils/constants';

// Interface
import { MovieInsertInput, MovieInsertValidation } from '../../../../interfaces/movie';
// import { Rate } from '../../../../interfaces/rate';
import { ScreenType } from '../../../../interfaces/screenType';

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
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

// Custom Component
import CheckboxGroup from '../../../../components/CheckboxGroup';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import { Rate } from '../../../../interfaces/rate';

interface IDialogAddMovieProps {
  isOpen: boolean,
  screenTypeList: ScreenType[],
  rateList: Rate[],
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddMovie: FunctionComponent<IDialogAddMovieProps> = (props) => {
  const [movieInput, setMovieInput] = useState<MovieInsertInput>({ imdb: '', endAt: moment().add(1, 'hour').startOf('hour').toISOString(), screenTypeIds: [], rateId: -1 });
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [errors, setErrors] = useState<MovieInsertValidation>({ imdb: '', screenTypes: '', rate: '' });
  const [requestError, setRequestError] = useState('');

  console.log((movieInput.endAt).slice(0, -5));
  console.log(moment().add(1, 'hour').startOf('hour'));

  const onDialogEnter = () => {
	setMovieInput({ imdb: '', endAt: moment().add(1, 'hour').startOf('hour').toISOString(), screenTypeIds: [], rateId: -1 });
	setErrors({ imdb: '', screenTypes: '', rate: '' });
	setRequestError('');
  }

  const onDialogClose = () => {
    props.onClose();
  }

const validateInput = () : boolean => {
	let validationResult: MovieInsertValidation = { imdb: '', screenTypes: '', rate: '' };
	let isOK = true;
	if (movieInput.imdb.length === 0) {
		validationResult.imdb = Constants.ERROR_MSG_FIELD_REQUIRED;
		isOK = false;
	}
	if (!(movieInput.screenTypeIds.length > 0)) {
		validationResult.screenTypes = Constants.ERROR_MSG_FIELD_REQUIRED;
		isOK = false;
  }
  if (movieInput.rateId === -1) {
    validationResult.rate = Constants.ERROR_MSG_FIELD_REQUIRED;
    isOK = false;
  }
	setErrors({ ...validationResult });
	return isOK;
}

  const onDialogSave = () => {
	const isOK = validateInput();
	if (isOK) {
		setIsLoadingSave(true);
		movieAPI.addMovie(movieInput)
		  .then(response => {
			setIsLoadingSave(false);
			console.log(response);
			props.onSave();
		  })
		  .catch(err => {
			setIsLoadingSave(false);
			setRequestError(err.toString());
			console.log(err);
		  });
	}
  }

  const renderScreenTypeCheckboxes = () => {
    return (
      <FormGroup style={{marginLeft: 10, marginBottom: 20,}}>
        <FormLabel style={{ color: errors.screenTypes.length > 0 ? "red" : "rgba(0, 0, 0, 0.54)" }}>Screen types:</FormLabel>
        <div style={{display: 'flex',}}>
          <CheckboxGroup
            options={props.screenTypeList}
            fieldValue="id"
            fieldLabel="name"
            selectedValues={movieInput.screenTypeIds}
            onChange={(newSelectedValues: any) => { setMovieInput({ ...movieInput, screenTypeIds: newSelectedValues }) }}
          />
        </div>
		{
			errors.screenTypes.length > 0 &&
			<div style={{ color: "red", fontSize: "0.75rem", fontWeight: 400 }}>{errors.screenTypes}</div>
		}
      </FormGroup>
    )
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()}>
      <DialogTitle id="form-dialog-title">Add Movie</DialogTitle>
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
			error={errors.imdb.length > 0}
			helperText={errors.imdb}
			required
			label="Imdb ID"
			style={{ margin: 10, marginBottom: 20, }}
			placeholder="tt7286456"
			fullWidth
			margin="normal"
			InputLabelProps={{ shrink: true, }}
			variant="outlined"
			value={movieInput.imdb}
			onChange={(event) => {setMovieInput({...movieInput, imdb: event.target.value })}}
        />
        {renderScreenTypeCheckboxes()}
        <FormControl style={{ margin: 10, marginBottom: 20, }} fullWidth>
          {/* <InputLabel id="rate-select-label">Rate</InputLabel> */}
          <FormLabel style={{ color: errors.rate.length > 0 ? "red" : "rgba(0, 0, 0, 0.54)" }}>Rate:</FormLabel>
          <Select
            labelId="rate-select-label"
            value={movieInput.rateId}
            variant="outlined"
            style={{ marginTop: 5, }}
            onChange={(event) => {setMovieInput({...movieInput, rateId: event.target.value as number})}}
          >
            {props.rateList.map(rate => (
              <MenuItem key={rate.id} value={rate.id}>{rate.name}</MenuItem>
            ))}
          </Select>
          {
            errors.rate.length > 0 &&
            <div style={{ color: "red", fontSize: "0.75rem", fontWeight: 400 }}>{errors.rate}</div>
          }
        </FormControl>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            required
            label="End at"
            inputVariant="outlined"
            style={{ margin: 10, marginBottom: 20 }}
            fullWidth
            minDate={moment()}
            value={movieInput.endAt}
            onChange={(date) => {
              if (date) {
                setMovieInput({...movieInput, endAt: date.toISOString()});
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

export default DialogAddMovie;