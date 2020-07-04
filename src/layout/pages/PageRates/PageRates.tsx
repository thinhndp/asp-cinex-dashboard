import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as rateAPI from '../../../api/rateAPI';

// Interface
import { Rate } from '../../../interfaces/rate';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import DialogAddOrEditRate from './components/DialogAddOrEditRate';
import DialogYesNo from '../../../components/DialogYesNo';

// Class
// import classes from './PageRates.module.scss';

const PageRates: FunctionComponent = () => {
  const [rates, setRates] = useState<Array<Rate>>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Add or edit Dialog
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  const [rateToEdit, setRateToEdit] = useState<Rate | null>(null);
  // Delete Dialog
  const [rateIdToDelete, setRateIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<Rate>> = [
    { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    { title: 'Name', field: 'name' },
    { title: 'Minimum Age Allowed', field: 'minAge' },
  ]

  useEffect(() => {
    getAllRates();
  }, []);

  const getAllRates = () => {
    setIsTableLoading(true);
    rateAPI.getAllRates()
      .then(response => {
        setIsTableLoading(false);
        setRates(response.data);
      })
      .catch(err => {
        setIsTableLoading(false);
        console.log(err);
      })
  }

  const onAddClick = () => {
    setIsDialogAddOrEditOpen(true);
  }

  const onUpdateClick = (event: any, rate: any) => {
    setRateToEdit(rate);
    setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, rate: any) => {
    setIsDialogDeleteOpen(true);
    setRateIdToDelete(rate.id);
  }

  const deleteRate = (id: string) => {
    setIsLoadingDelete(true);
    rateAPI.deleteRate(id)
      .then((response) => {
        setIsLoadingDelete(false);
        closeDialogDelete();
        getAllRates();
      })
      .catch((err) => {
        setIsLoadingDelete(false);
        console.log(err + 'ddm');
      })
  }

  const closeDialogDelete = () => {
    setIsDialogDeleteOpen(false);
    setRateIdToDelete('');
  }

  return (
    <div>
      <MaterialTable
        title="Rates"
        isLoading={isTableLoading}
        columns={columns}
        data={rates}
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
              return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Rate</Button>;
            }

            return <MTableAction {...prevProps} />
          }
        }}
      />

      <DialogAddOrEditRate
        rateToEdit={rateToEdit}
        isOpen={isDialogAddOrEditOpen}
        onClose={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setRateToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setRateToEdit(null);
          }, 150);

          getAllRates();
        }}
      />

      <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteRate(rateIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      />
    </div>
  );
}

export default PageRates;