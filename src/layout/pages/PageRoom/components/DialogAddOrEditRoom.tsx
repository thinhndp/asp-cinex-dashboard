import React, { useState, FunctionComponent } from 'react';

// Misc
import * as roomAPI from '../../../../api/roomAPI';
import * as Constants from '../../../../utils/constants';

// Interface
import { Room, RoomInput, RoomValidation } from '../../../../interfaces/room';
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
  const [errors, setErrors] = useState<RoomValidation>({ name: '', screenTypes: '', totalRows: '', totalSeatsPerRow: '' });
  const [requestError, setRequestError] = useState('');

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
	setErrors({ name: '', screenTypes: '', totalRows: '', totalSeatsPerRow: '' });
	setRequestError('');
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const validateInput = () : boolean => {
	let validationResult: RoomValidation = { name: '', screenTypes: '', totalRows: '', totalSeatsPerRow: '' };
	let isOK = true;
	if (roomInput.name.length === 0) {
		validationResult.name = Constants.ERROR_MSG_FIELD_REQUIRED;
		isOK = false;
	}
	if (!(roomInput.screenTypeIds.length > 0)) {
		validationResult.screenTypes = Constants.ERROR_MSG_FIELD_REQUIRED;
		isOK = false;
	}
	if (!(roomInput.totalRows > 0)) {
		validationResult.totalRows = Constants.ERROR_MSG_FIELD_NOT_POSITIVE_NUMBER;
		isOK = false;
	} 
	if (!(roomInput.totalSeatsPerRow > 0)) {
		validationResult.totalSeatsPerRow = Constants.ERROR_MSG_FIELD_NOT_POSITIVE_NUMBER;
		isOK = false;
	} 
	setErrors({ ...validationResult });
	return isOK;
}

  const onDialogSave = () => {
	const isOK = validateInput();
	if (isOK) {
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
			  setRequestError(err.toString());
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
			  setRequestError(err.toString());
			  console.log(err);
			})
		}
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
            selectedValues={roomInput.screenTypeIds}
            onChange={(newSelectedValues: any) => { setRoomInput({ ...roomInput, screenTypeIds: newSelectedValues }) }}
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
      <DialogTitle id="form-dialog-title">{!props.roomToEdit ? `Add Room` : `Edit Room: ${props.roomToEdit.name}`}</DialogTitle>
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
			error={errors.name.length > 0}
			helperText={errors.name}
			required
			label="Room name"
			style={{ margin: 10, marginBottom: 20, }}
			placeholder="Room 1"
			fullWidth
			margin="normal"
			InputLabelProps={{ shrink: true, }}
			variant="outlined"
			value={roomInput.name}
			onChange={(event) => {setRoomInput({...roomInput, name: event.target.value })}}
        />
        {renderScreenTypeCheckboxes()}
        <TextField
			error={errors.totalSeatsPerRow.length > 0}
			helperText={errors.totalSeatsPerRow}
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
			error={errors.totalRows.length > 0}
			helperText={errors.totalRows}
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