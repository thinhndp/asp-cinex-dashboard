import React, { FunctionComponent } from 'react';

// Component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconHelpOutline from '@material-ui/icons/HelpOutline';

interface IDialogYesNoProps {
  isOpen: boolean,
  isLoadingYes?: boolean,
  labelTitle?: string,
  labelYes?: string,
  labelNo?: string,
  onYes: Function,
  onNo: Function,
  onClose: Function,
}

const DialogYesNo: FunctionComponent<IDialogYesNoProps> = (props) => {
  const onDialogEnter = () => {
  }

  const onDialogYes = () => {
    props.onYes();
  }

  const onDialogNo = () => {
    props.onNo();
  }

  const onDialogClose = () => {
    props.onClose();
  }

  return (
    <Dialog open={props.isOpen} onEnter={() => onDialogEnter()} onClose={() => onDialogClose()}>
      <DialogTitle>{props.labelTitle}</DialogTitle>
      <DialogContent style={{textAlign: 'center'}}>
        <IconHelpOutline color="primary" style={{fontSize: '120px', margin: '0px 40px'}} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onDialogNo()} color="primary">
          {props.labelNo}
        </Button>
        <div style={{position: 'relative'}}>
          {/* Extra <div> is for loading */}
          <Button onClick={() => onDialogYes()} color="primary" variant="contained" disabled={props.isLoadingYes}>
            {props.labelYes}
          </Button>
          {props.isLoadingYes ? <CircularProgress size={24} className="circular-center-size-24px" /> : null}
        </div>
      </DialogActions>
    </Dialog>
  );
}

DialogYesNo.defaultProps = {
  isOpen: false,
  isLoadingYes: false,
  labelTitle: 'Are you sure?',
  labelYes: 'Yes',
  labelNo: 'No',
}

export default DialogYesNo;