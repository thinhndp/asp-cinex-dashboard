import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as screenTypeAPI from '../../../api/screenTypeAPI';

// Interface
import { ScreenType } from '../../../interfaces/screenType';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import DialogAddOrEditScreenType from './components/DialogAddOrEditScreenType';
import DialogYesNo from '../../../components/DialogYesNo';

// Class
// import classes from './PageScreenTypes.module.scss';

const PageScreenTypes: FunctionComponent = () => {
  const [screenTypes, setScreenTypes] = useState<Array<ScreenType>>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Add or edit Dialog
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  const [screenTypeToEdit, setScreenTypeToEdit] = useState<ScreenType | null>(null);
  // Delete Dialog
  const [screenTypeIdToDelete, setScreenTypeIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<ScreenType>> = [
    { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    { title: 'Name', field: 'name' },
  ]

  useEffect(() => {
    getAllScreenTypes();
  }, []);

  const getAllScreenTypes = () => {
    setIsTableLoading(true);
    screenTypeAPI.getAllScreenTypes()
      .then(response => {
        setIsTableLoading(false);
        setScreenTypes(response.data);
      })
      .catch(err => {
        setIsTableLoading(false);
        console.log(err);
      })
  }

  const onAddClick = () => {
    setIsDialogAddOrEditOpen(true);
  }

  const onUpdateClick = (event: any, screenType: any) => {
    setScreenTypeToEdit(screenType);
    setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, screenType: any) => {
    setScreenTypeIdToDelete(screenType.id);
    setIsDialogDeleteOpen(true);
  }

  const deleteScreenType = (id: string) => {
    setIsLoadingDelete(true);
    screenTypeAPI.deleteScreenType(id)
      .then((response) => {
        setIsLoadingDelete(false);
        closeDialogDelete();
        getAllScreenTypes();
      })
      .catch((err) => {
        setIsLoadingDelete(false);
        console.log(err);
      })
  }

  const closeDialogDelete = () => {
    setIsDialogDeleteOpen(false);
    setScreenTypeIdToDelete('');
  }

  return (
    <div>
      <MaterialTable
        title="ScreenTypes"
        isLoading={isTableLoading}
        columns={columns}
        data={screenTypes}
        options={{
          headerStyle: {
            backgroundColor: '#009be5',
            color: '#fff',
          },
          rowStyle: {
            backgroundColor: '#eee',
          },
        }}
        actions={[
          { icon: 'edit', tooltip: 'Edit', onClick: (event, rowData) => onUpdateClick(event, rowData) },
          { icon: 'delete', tooltip: 'Delete', onClick: (event, rowData) => onDeleteClick(event, rowData) },
          { icon: 'add', tooltip: 'Add', onClick: () => {}, isFreeAction: true }, // Will be overrided right below
        ]}
        components={{
          Action: prevProps => {
            if (prevProps.action.icon === 'add') {
              // Override 'add' Action
              return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add ScreenType</Button>;
            }

            return <MTableAction {...prevProps} />
          }
        }}
      />

      <DialogAddOrEditScreenType
        screenTypeToEdit={screenTypeToEdit}
        isOpen={isDialogAddOrEditOpen}
        onClose={() => {
          setIsDialogAddOrEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setScreenTypeToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setScreenTypeToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOrEditOpen(false);

          // setTimeout temp fix: transition (animation) doesn't catch up on setScreenTypeToEdit(null)
          // TODO: Fix this
          setTimeout(() => {
            setScreenTypeToEdit(null);
          }, 150);

          getAllScreenTypes();
        }}
      />

      <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteScreenType(screenTypeIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      />
    </div>
  );
}

export default PageScreenTypes;