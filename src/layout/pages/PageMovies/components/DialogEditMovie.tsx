import React, { useState, FunctionComponent } from 'react';

// Misc
import * as movieAPI from '../../../../api/movieAPI';
import moment from 'moment';

// Interface
import { Movie, MovieUpdateInput } from '../../../../interfaces/movie';
import { Rate } from '../../../../interfaces/rate';
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
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

// Custom Component
import CheckboxGroup from '../../../../components/CheckboxGroup';
import MultipleInputActors from './MultipleInputActors';

interface IDialogAddMovieProps {
  movieToEdit: Movie | null,
  isOpen: boolean,
  rateList: Rate[]
  screenTypeList: ScreenType[],
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddMovie: FunctionComponent<IDialogAddMovieProps> = (props) => {
  const [movieInput, setMovieInput] = useState<MovieUpdateInput>({ title: '', storyline: '', actors: [], releasedAt: '', endAt: moment().add(1, 'hour').startOf('hour').toISOString(), poster: '', trailer: '', wallpapers: [''], rateId: '', screenTypeIds: [], });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onDialogEnter = () => {
    if (props.movieToEdit) {
      setMovieInput({
        title: props.movieToEdit.title,
        storyline: props.movieToEdit.storyline ? props.movieToEdit.storyline : '',
        actors: [...props.movieToEdit.actors],
        releasedAt: props.movieToEdit.releasedAt,
        endAt: props.movieToEdit.endAt,
        poster: props.movieToEdit.poster,
        trailer: props.movieToEdit.trailer ? props.movieToEdit.trailer : '',
        wallpapers: props.movieToEdit.wallpapers ? props.movieToEdit.wallpapers : [''],
        rateId: props.movieToEdit.rate ? props.movieToEdit.rate.id : '',
        screenTypeIds: props.movieToEdit.screenTypes.map(screenType => screenType.id),
      });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    if (props.movieToEdit) {
      movieAPI.updateMovie(props.movieToEdit.id, movieInput)
        .then(response => {
          setIsLoadingSave(false);
          console.log(response);
          props.onSave();
        })
        .catch(err => {
          setIsLoadingSave(false);
          console.log(err);
        });
    }
  }

  const renderScreenTypeCheckboxes = () => {
    return (
      <FormGroup style={{marginLeft: 10, marginBottom: 20,}}>
        <FormLabel>Screen types:</FormLabel>
        <div style={{display: 'flex',}}>
          <CheckboxGroup
            options={props.screenTypeList}
            fieldValue="id"
            fieldLabel="name"
            selectedValues={movieInput.screenTypeIds}
            onChange={(newSelectedValues: any) => { setMovieInput({ ...movieInput, screenTypeIds: newSelectedValues }) }}
          />
        </div>
      </FormGroup>
    )
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()} fullWidth maxWidth="md">
      <DialogTitle id="form-dialog-title">Edit Movie: {props.movieToEdit?.title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField
              required
              label="Movie title"
              style={{ margin: 10, marginBottom: 20, }}
              placeholder="Avengers: Endgame"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, }}
              variant="outlined"
              value={movieInput.title}
              onChange={(event) => {setMovieInput({...movieInput, title: event.target.value })}}
            />
            {renderScreenTypeCheckboxes()}
            {/* <TextField
              required
              label="Release date"
              type="date"
              style={{ margin: 10, marginBottom: 20, }}
              placeholder="2020-01-20"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, }}
              variant="outlined"
              value={movieInput.released}
              onChange={(event) => {setMovieInput({...movieInput, released: event.target.value }); console.log(event.target.value)}}
            />
            <TextField
              required
              label="End at"
              type="date"
              style={{ margin: 10, marginBottom: 20, }}
              placeholder="2020-01-20"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, }}
              variant="outlined"
              value={movieInput.endAt}
              onChange={(event) => {setMovieInput({...movieInput, endAt: event.target.value }); console.log(event.target.value)}}
            /> */}
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                required
                label="End at"
                inputVariant="outlined"
                style={{ margin: 10, marginBottom: 20 }}
                fullWidth
                minDate={moment()}
                minutesStep={5}
                value={movieInput.endAt}
                onChange={(date) => {
                  if (date) {
                    setMovieInput({...movieInput, endAt: date.toISOString()});
                  }
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              required
              label="Storyline"
              style={{ margin: 10, marginBottom: 20, }}
              placeholder="After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe."
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, }}
              variant="outlined"
              value={movieInput.storyline}
              onChange={(event) => {setMovieInput({...movieInput, storyline: event.target.value })}}
            />
            <FormControl style={{ margin: 10, marginBottom: 20, }} fullWidth>
              {/* <InputLabel id="rate-select-label">Rate</InputLabel> */}
              <FormLabel>Rate:</FormLabel>
              <Select
                labelId="rate-select-label"
                value={movieInput.rateId}
                variant="outlined"
                style={{ marginTop: 5, }}
                onChange={(event) => {setMovieInput({...movieInput, rateId: event.target.value as string})}}
              >
                {props.rateList.map(rate => (
                  <MenuItem key={rate.id} value={rate.id}>{rate.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <MultipleInputActors
              value={movieInput.actors}
              onChange={(newActors: any) => {setMovieInput({...movieInput, actors: [...newActors]})}}
            />
          </Grid>
          <Grid item xs={4} style={{textAlign: 'center'}}>
            <TextField
              required
              label="Poster"
              style={{ margin: 10, }}
              placeholder="https://images-na.ssl-images-amazon.com/images/I/71YhAoqjX0L._SY606_.jpg"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, }}
              variant="outlined"
              value={movieInput.poster}
              onChange={(event) => {setMovieInput({...movieInput, poster: event.target.value })}}
            />
            <img src={movieInput.poster} alt={movieInput.title} style={{width: 200, height: 300,}} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Trailer"
              style={{ margin: 10, marginBottom: 20, }}
              placeholder="https://www.youtube.com/watch?v=TcMBFSGVi1c"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, }}
              variant="outlined"
              value={movieInput.trailer}
              onChange={(event) => {setMovieInput({...movieInput, trailer: event.target.value })}}
            />
            <TextField
              required
              label="Wallpaper"
              style={{ margin: 10, marginBottom: 20, }}
              placeholder="https://i.pinimg.com/originals/36/bd/7c/36bd7c8bbdd16c2e9bb3ae331f0e47a9.jpg"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, }}
              variant="outlined"
              value={movieInput.wallpapers[0]}
              onChange={(event) => {setMovieInput({...movieInput, wallpapers: [event.target.value] })}}
            />
          </Grid>
        </Grid>
        
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