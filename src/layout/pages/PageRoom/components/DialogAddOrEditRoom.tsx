import React, { useState, FunctionComponent } from 'react';

// Misc
import * as roomAPI from '../../../../api/roomAPI';

// Interface
import { Room, RoomInput } from '../../../../interfaces/room';
import { Cluster } from '../../../../interfaces/cluster';
import { ScreenType } from '../../../../interfaces/screenType';

// Component
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
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

// Custom Component
import CheckboxGroup from '../../../../components/CheckboxGroup';

interface IDialogAddOrEditRoomProps {
  roomToEdit: Room | null, // null: DialogAdd. not null: DialogEdit
  isOpen: boolean,
  clusterList: Cluster[],
  screenTypeList: ScreenType[],
  selectedClusterId: string,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditRoom: FunctionComponent<IDialogAddOrEditRoomProps> = (props) => {
  const [roomInput, setRoomInput] = useState<RoomInput>({ name: '', clusterId: props.selectedClusterId, screenTypeIds: [], totalRows: 0, totalSeatsPerRow: 0 });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onDialogEnter = () => {
    if (!props.roomToEdit) {
      setRoomInput({ name: '', clusterId: props.selectedClusterId, screenTypeIds: [], totalRows: 0, totalSeatsPerRow: 0 });
    } else {
      setRoomInput({
        name: props.roomToEdit.name,
        clusterId: props.selectedClusterId,
        screenTypeIds: props.roomToEdit.screenTypes.map(screenType => screenType.id),
        totalRows: props.roomToEdit.totalRows,
        totalSeatsPerRow: props.roomToEdit.totalSeatsPerRow,
      });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    if (!props.roomToEdit) {
      // Add Room
      roomAPI.addRoom(roomInput)
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
      // Update Room
      roomAPI.updateRoom(props.roomToEdit.id, roomInput)
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

  const renderScreenTypeCheckboxes = () => {
    return (
      <FormGroup style={{marginLeft: 10, marginBottom: 20,}}>
        <FormLabel>Screen types:</FormLabel>
        <div style={{display: 'flex',}}>
          <CheckboxGroup
            options={props.screenTypeList}
            fieldValue="id"
            fieldLabel="name"
            selectedValues={roomInput.screenTypeIds}
            onChange={(newSelectedValues: any) => { setRoomInput({ ...roomInput, screenTypeIds: newSelectedValues }) }}
          />
        </div>
      </FormGroup>
    )
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()}>
      <DialogTitle id="form-dialog-title">{!props.roomToEdit ? `Add Room` : `Edit Room: ${props.roomToEdit.name}`}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText>
        <FormControl style={{ margin: 10, marginBottom: 20, }} fullWidth>
          {/* <InputLabel id="rate-select-label">Rate</InputLabel> */}
          <FormLabel>Cluster:</FormLabel>
          <Select
            labelId="cluster-select-label"
            value={roomInput.clusterId}
            variant="outlined"
            style={{ marginTop: 5, }}
            onChange={(event) => {setRoomInput({...roomInput, clusterId: event.target.value as string})}}
          >
            {props.clusterList.map(cluster => (
              <MenuItem key={cluster.id} value={cluster.id}>{cluster.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required
          label="Room name"
          style={{ margin: 10, marginBottom: 20, }}
          placeholder="Sci-Fi"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={roomInput.name}
          onChange={(event) => {setRoomInput({...roomInput, name: event.target.value })}}
        />
        {renderScreenTypeCheckboxes()}
        <TextField
          required
          label="Seats per row"
          type="number"
          style={{ margin: 10, marginBottom: 20, }}
          placeholder="8"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={roomInput.totalSeatsPerRow}
          onChange={(event) => {setRoomInput({...roomInput, totalSeatsPerRow: event.target.value ? parseInt(event.target.value) : 0 })}}
        />
        <TextField
          required
          label="Total rows"
          type="number"
          style={{ margin: 10, marginBottom: 20, }}
          placeholder="10"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={roomInput.totalRows}
          onChange={(event) => {setRoomInput({...roomInput, totalRows: event.target.value ? parseInt(event.target.value) : 0 })}}
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

export default DialogAddOrEditRoom;