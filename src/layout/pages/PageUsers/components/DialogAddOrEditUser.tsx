import React, { useState, FunctionComponent } from 'react';

// Misc
import * as userAPI from '../../../../api/userAPI';

// Interface
import { User, UserInput, Role } from '../../../../interfaces/user';

// Component
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormLabel from '@material-ui/core/FormLabel';

// Custom Component
import CheckboxGroup from '../../../../components/CheckboxGroup';

interface IDialogAddOrEditUserProps {
  userToEdit: User | null, // null: DialogAdd. not null: DialogEdit
  roleList: Array<Role>,
  isOpen: boolean,
  onClose: Function, // Call this to close Dialog
  onSave: Function, // Call this to close Dialog & refresh table
}

const DialogAddOrEditUser: FunctionComponent<IDialogAddOrEditUserProps> = (props) => {
  const [userInput, setUserInput] = useState<UserInput>({ username: '', roleIds: [], cPoint: 0 });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const onDialogEnter = () => {
    if (!props.userToEdit) {
      setUserInput({ username: '', roleIds: [], cPoint: 0 });
    } else {
      console.log(props.userToEdit);
      setUserInput({
			username: props.userToEdit.username,
			roleIds: props.userToEdit.roles.map(role => role.id),
			cPoint: props.userToEdit.cPoint
      });
    }
  }

  const onDialogClose = () => {
    props.onClose();
  }

  const onDialogSave = () => {
    setIsLoadingSave(true);
    if (!props.userToEdit) {
      // // Add
      // userAPI.addUser(userInput)
      //   .then(response => {
      //     setIsLoadingSave(false);
      //     console.log(response);
      //     props.onSave();
      //   })
      //   .catch(err => {
      //     setIsLoadingSave(false);
      //     console.log(err);
      //   })
    } else {
      // Update
      userAPI.updateUser(props.userToEdit.id, userInput)
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
      <DialogTitle id="form-dialog-title">{!props.userToEdit ? `Add User` : `Edit User: ${props.userToEdit.username}`}</DialogTitle>
      <DialogContent dividers>
        {/* <DialogContentText>
          Please fill those fields below to continue.
        </DialogContentText> */}
        <FormLabel>Roles:</FormLabel>
        <CheckboxGroup
          options={props.roleList}
          fieldValue="id"
          fieldLabel="role"
          selectedValues={userInput.roleIds}
          onChange={(newSelectedValues: any) => {
            console.log(newSelectedValues)
            setUserInput({ ...userInput, roleIds: [...newSelectedValues] }) }
          }
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

export default DialogAddOrEditUser;