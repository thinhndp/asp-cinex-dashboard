import React, { useState, FunctionComponent, useEffect } from 'react';

// Misc
import * as showtimeAPI from '../../../../api/showtimeAPI';
import moment from 'moment';

// Interface
import { Showtime, ShowtimeInput } from '../../../../interfaces/showtime';
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
  const [showtimeInput, setShowtimeInput] = useState<ShowtimeInput>({ movieId: '', price: 10, roomId: '', screenTypeId: '', startAt: moment().add(1, 'hour').startOf('hour').toISOString() });
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)
  const [screenTypeAvailableList, setScreenTypeAvailableList] = useState<Array<ScreenType>>([]);

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
      setShowtimeInput({ movieId: '', price: 10, roomId: '', screenTypeId: '', startAt: moment().add(1, 'hour').startOf('hour').toISOString() });
      // const newScreenTypeAvailableList = intersectScreenTypes2('', '');
      // setScreenTypeAvailableList(newScreenTypeAvailableList);
    } else {
      // const newScreenTypeAvailableList = intersectScreenTypes2(props.showtimeToEdit.movie.id, props.showtimeToEdit.room.id);
      // setScreenTypeAvailableList(newScreenTypeAvailableList);
      setShowtimeInput({
        movieId: props.showtimeToEdit.movie.id,
        price: props.showtimeToEdit.price,
        roomId: props.showtimeToEdit.room.id,
        screenTypeId: props.showtimeToEdit.screenType.id,
        startAt: props.showtimeToEdit.startAt,
      });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
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
          console.log(err);
        })
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
        <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText>
        <FormControl style={{ marginBottom: 30, }} fullWidth>
          <FormLabel>Movie:</FormLabel>
          <Select
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
        </FormControl>
        <FormControl style={{ marginBottom: 30, paddingRight: 10, width: '50%' }}>
          <FormLabel>Room:</FormLabel>
          <Select
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
        </FormControl>
        <FormControl style={{ marginBottom: 30, width: '50%' }}>
          <FormLabel>Screen type:</FormLabel>
          <Select
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
          required
          label="Price ($)"
          type="number"
          style={{ marginBottom: 30, width: '50%' }}
          placeholder="tt7286456"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={showtimeInput.price}
          onChange={(event) => {setShowtimeInput({...showtimeInput, price: parseInt(event.target.value) })}}
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