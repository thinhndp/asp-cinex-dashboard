import React, { useState, FunctionComponent } from 'react';

// Misc
import * as clusterAPI from '../../../../api/clusterAPI';

// Interface
import { Cluster, ClusterInput } from '../../../../interfaces/cluster';

// Component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

interface IDialogAddOrEditClusterProps {
  clusterToEdit: Cluster | null, // null: DialogAdd. not null: DialogEdit
  isOpen: boolean,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditCluster: FunctionComponent<IDialogAddOrEditClusterProps> = (props) => {
  const [clusterInput, setClusterInput] = useState<ClusterInput>({ name: '', manager: 'cinema-Admin', address: '', hotline: '' });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onDialogEnter = () => {
    if (!props.clusterToEdit) {
      setClusterInput({ name: '', manager: 'cinema-Admin', address: '', hotline: '' });
    } else {
      setClusterInput({ name: props.clusterToEdit.name, address: props.clusterToEdit.address, hotline: props.clusterToEdit.hotline, manager: 'cinema-Admin' });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    if (!props.clusterToEdit) {
      // Add
      clusterAPI.addCluster(clusterInput)
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
      clusterAPI.updateCluster(props.clusterToEdit.id, clusterInput)
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
      <DialogTitle id="form-dialog-title">{!props.clusterToEdit ? `Add Cluster` : `Edit Cluster: ${props.clusterToEdit.name}`}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText>
        <TextField
          required
          id="outlined-full-width"
          label="Cluster name"
          style={{ margin: 8 }}
          placeholder="Cinex Las Vegas"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={clusterInput.name}
          onChange={(event) => {setClusterInput({...clusterInput, name: event.target.value })}}
        />
        <TextField
          required
          id="outlined-full-width"
          label="Address"
          style={{ margin: 8 }}
          placeholder="136 Metropolitan Ave, Brooklyn, NY 11249-3952"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={clusterInput.address}
          onChange={(event) => {setClusterInput({...clusterInput, address: event.target.value })}}
        />
        <TextField
          required
          id="outlined-full-width"
          label="Hotline"
          style={{ margin: 8 }}
          placeholder="028 7300 9999"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true, }}
          variant="outlined"
          value={clusterInput.hotline}
          onChange={(event) => {setClusterInput({...clusterInput, hotline: event.target.value })}}
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

export default DialogAddOrEditCluster;