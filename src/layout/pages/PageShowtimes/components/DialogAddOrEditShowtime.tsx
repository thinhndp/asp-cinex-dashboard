import React, { useState, FunctionComponent, useEffect } from 'react';

// Misc
import * as showtimeAPI from '../../../../api/showtimeAPI';
import moment from 'moment';
import * as Constants from '../../../../utils/constants';

// Interface
import { Showtime, ShowtimeInput, ShowtimeValidation } from '../../../../interfaces/showtime';
import { Movie } from '../../../../interfaces/movie';
import { Room } from '../../../../interfaces/room';
import { ScreenType } from '../../../../interfaces/screenType';

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
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { Cluster } from '../../../../interfaces/cluster';

interface IDialogAddOrEditShowtimeProps {
  showtimeToEdit: Showtime | null, // null: DialogAdd. not null: DialogEdit
  isOpen: boolean,
  clusterList: Cluster[],
  selectedClusterId: string,
  movieList: Movie[],
  roomList: Room[],
  screenTypeList: ScreenType[],
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditShowtime: FunctionComponent<IDialogAddOrEditShowtimeProps> = (props) => {
  const [showtimeInput, setShowtimeInput] = useState<ShowtimeInput>({ status: 'OPEN', movieId: '', basePrice: 10, roomId: '', screenTypeId: '', startAt: moment().add(1, 'hour').startOf('hour').toISOString() });
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)
  const [screenTypeAvailableList, setScreenTypeAvailableList] = useState<Array<ScreenType>>([]);
  const [errors, setErrors] = useState<ShowtimeValidation>({ movieId: '', basePrice: '', roomId: '', screenTypeId: '' });
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    const newSelectedCluster = props.clusterList.find(cluster => cluster.id === props.selectedClusterId);
    if (newSelectedCluster) {
      setSelectedCluster(newSelectedCluster);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedClusterId]);

  useEffect(() => {
    const newScreenTypeAvailableList = intersectScreenTypes(showtimeInput.movieId, showtimeInput.roomId);
    setScreenTypeAvailableList(newScreenTypeAvailableList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showtimeInput.movieId, showtimeInput.roomId]);

  useEffect(() => {
    if (!screenTypeAvailableList.map(screenType => screenType.id).includes(showtimeInput.screenTypeId)) {
      // Clear showtimeInput.screenTypeId value if it's not valid
      setShowtimeInput({ ...showtimeInput, screenTypeId: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenTypeAvailableList]);

  const onDialogEnter = () => {
    if (!props.showtimeToEdit) {
      setShowtimeInput({ status: 'OPEN', movieId: '', basePrice: 10, roomId: '', screenTypeId: '', startAt: moment().add(1, 'hour').startOf('hour').toISOString() });
      // const newScreenTypeAvailableList = intersectScreenTypes2('', '');
      // setScreenTypeAvailableList(newScreenTypeAvailableList);
    } else {
      // const newScreenTypeAvailableList = intersectScreenTypes2(props.showtimeToEdit.movie.id, props.showtimeToEdit.room.id);
      // setScreenTypeAvailableList(newScreenTypeAvailableList);
      setShowtimeInput({
		status: props.showtimeToEdit.status,
        movieId: props.showtimeToEdit.movie.id,
        basePrice: props.showtimeToEdit.basePrice,
        roomId: props.showtimeToEdit.room.id,
        screenTypeId: props.showtimeToEdit.screenType.id,
        startAt: props.showtimeToEdit.startAt,
      });
	}
	setErrors({ movieId: '', basePrice: '', roomId: '', screenTypeId: '' });
	setRequestError('');
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const validateInput = () : boolean => {
	let validationResult: ShowtimeValidation = { movieId: '', basePrice: '', roomId: '', screenTypeId: '' };
	let isOK = true;
	if (showtimeInput.movieId.length === 0) {
		validationResult.movieId = Constants.ERROR_MSG_FIELD_REQUIRED;
		isOK = false;
	}
	if (showtimeInput.roomId.length === 0) {
		validationResult.roomId = Constants.ERROR_MSG_FIELD_REQUIRED;
		isOK = false;
	}
	if (showtimeInput.screenTypeId.length === 0) {
		validationResult.screenTypeId = Constants.ERROR_MSG_FIELD_REQUIRED;
		isOK = false;
	}
	if (!(showtimeInput.basePrice > 0)) {
		validationResult.basePrice = Constants.ERROR_MSG_FIELD_NOT_POSITIVE_NUMBER;
		isOK = false;
	}
	setErrors({ ...validationResult });
	return isOK;
}

  const onDialogSave = () => {
	const isOK = validateInput();
	if (isOK) {
		setIsLoadingSave(true);
		if (!props.showtimeToEdit) {
		  // Add Showtime
		  showtimeAPI.addShowtime(showtimeInput)
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
		  // Update Showtime
		  showtimeAPI.updateShowtime(props.showtimeToEdit.id, showtimeInput)
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
  
  const intersectScreenTypes = (movieId: string, roomId: string) => {
    const screenTypes1 = props.movieList.find(movie => movie.id === movieId)?.screenTypes;
    const screenTypes2 = props.roomList.find(room => room.id === roomId)?.screenTypes;

    if (!screenTypes1 || !screenTypes2) {
      return [];
    }

    return screenTypes1.filter(screenType1 => screenTypes2.findIndex(screenType2 => screenType2.id === screenType1.id) !== -1);
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()} fullWidth>
      <DialogTitle id="form-dialog-title">
        <div>{selectedCluster?.name}</div>
        <div>{!props.showtimeToEdit ? `Add Showtime` : `Edit Showtime: ${moment(props.showtimeToEdit.startAt).format('MMM. D, YYYY [at] h:mm A z')}`}</div>
      </DialogTitle>
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
        <FormControl style={{ marginBottom: 30, }} fullWidth>
			<FormLabel style={{ color: errors.movieId.length > 0 ? "red" : "rgba(0, 0, 0, 0.54)" }}>Movie:</FormLabel>
			<Select
				error={errors.movieId.length > 0}
				labelId="movie-select-label"
				value={showtimeInput.movieId}
				variant="outlined"
				style={{ marginTop: 5, }}
				onChange={(event) => {
				setShowtimeInput({...showtimeInput, movieId: event.target.value as string});
				}}
			>
				{props.movieList.map(movie => (
				<MenuItem key={movie.id} value={movie.id}>{movie.title}</MenuItem>
				))}
			</Select>
		  	{
				errors.movieId.length > 0 &&
				<div style={{ color: "red", fontSize: "0.75rem", fontWeight: 400 }}>{errors.movieId}</div>
			}
        </FormControl>
        <FormControl style={{ marginBottom: 30, paddingRight: 10, width: '50%' }}>
			<FormLabel style={{ color: errors.roomId.length > 0 ? "red" : "rgba(0, 0, 0, 0.54)" }}>Room:</FormLabel>
			<Select
				error={errors.roomId.length > 0}
				labelId="room-select-label"
				value={showtimeInput.roomId}
				variant="outlined"
				style={{ marginTop: 5, }}
				onChange={(event) => {
				setShowtimeInput({...showtimeInput, roomId: event.target.value as string});
				}}
			>
				{props.roomList.map(room => (
				<MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
				))}
			</Select>
			{
				errors.roomId.length > 0 &&
				<div style={{ color: "red", fontSize: "0.75rem", fontWeight: 400 }}>{errors.roomId}</div>
			}
        </FormControl>
        <FormControl style={{ marginBottom: 30, width: '50%' }}>
			<FormLabel style={{ color: errors.screenTypeId.length > 0 ? "red" : "rgba(0, 0, 0, 0.54)" }}>Screen type:</FormLabel>
			<Select
				error={errors.screenTypeId.length > 0}
				labelId="screenType-select-label"
				value={showtimeInput.screenTypeId}
				variant="outlined"
				style={{ marginTop: 5, }}
				onChange={(event) => {setShowtimeInput({...showtimeInput, screenTypeId: event.target.value as string})}}
			>
				{screenTypeAvailableList.map(screenType => (
				<MenuItem key={screenType.id} value={screenType.id}>{screenType.name}</MenuItem>
				))}
			</Select>
		  	{
				errors.screenTypeId.length > 0 &&
				<div style={{ color: "red", fontSize: "0.75rem", fontWeight: 400 }}>{errors.screenTypeId}</div>
			}
        </FormControl>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            label="Start at"
            inputVariant="outlined"
            style={{ marginBottom: 30, paddingRight: 10, width: '50%' }}
            minDate={moment()}
            minutesStep={5}
            value={showtimeInput.startAt}
            onChange={(date) => {
              if (date) {
                setShowtimeInput({...showtimeInput, startAt: date.toISOString()});
              }
            }}
          />
        </MuiPickersUtilsProvider>
        <TextField
			error={errors.basePrice.length > 0}
			helperText={errors.basePrice}
			required
			label="Price ($)"
			type="number"
			style={{ marginBottom: 30, width: '50%' }}
			placeholder="tt7286456"
			InputLabelProps={{ shrink: true, }}
			variant="outlined"
			value={showtimeInput.basePrice}
			onChange={(event) => {setShowtimeInput({...showtimeInput, basePrice: parseInt(event.target.value) })}}
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

export default DialogAddOrEditShowtime;