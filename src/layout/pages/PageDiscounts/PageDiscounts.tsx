import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as discountAPI from '../../../api/discountAPI';
import moment from 'moment';

// Interface
import { Discount } from '../../../interfaces/discount';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import DialogAddOrEditDiscount from './components/DialogAddOrEditDiscount';
import DialogYesNo from '../../../components/DialogYesNo';

// Class
// import classes from './PageRates.module.scss';

const PageDiscounts: FunctionComponent = () => {
  const [discounts, setDiscounts] = useState<Array<Discount>>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Add or edit Dialog
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  const [discountToEdit, setDiscountToEdit] = useState<Discount | null>(null);
  // Delete Dialog
  const [discountIdToDelete, setDiscountIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<Discount>> = [
    { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    { title: 'Name', field: 'name' },
    { 
      title: 'Discount',
      field: 'discount',
      render: (rowData) => {
        const discountDisplay = rowData.discount + '%';
        return (<span>{discountDisplay}</span>)
      }
    },
    { 
      title: 'Expire at',
      field: 'expire',
      render: (rowData) => {
        const expireAtDisplay = moment(rowData.expire).format('MMM. D, YYYY [at] h:mm A z');
        return (<span>{expireAtDisplay}</span>)
      }
    },
    { 
      title: 'Status', 
      field: 'active',
      render: (rowData) => {
        const statusDisplay = rowData.active ? 'ACTIVE' : 'INACTIVE';
        return (<span>{statusDisplay}</span>)
      }
    },
  ]

  useEffect(() => {
    getAllDiscounts();
  }, []);

  const getAllDiscounts = () => {
    setIsTableLoading(true);
    discountAPI.getAllDiscounts()
      .then(response => {
        setIsTableLoading(false);
        setDiscounts(response.data);
      })
      .catch(err => {
        setIsTableLoading(false);
        console.log(err);
      })
  }

  const onAddClick = () => {
    setIsDialogAddOrEditOpen(true);
  }

  const onUpdateClick = (event: any, discount: any) => {
    setDiscountToEdit(discount);
    setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, discount: any) => {
    setIsDialogDeleteOpen(true);
    setDiscountIdToDelete(discount.id);
  }

  const deleteDiscount = (id: string) => {
    setIsLoadingDelete(true);
    discountAPI.deleteDiscount(id)
      .then((response) => {
        setIsLoadingDelete(false);
        closeDialogDelete();
        getAllDiscounts();
      })
      .catch((err) => {
        setIsLoadingDelete(false);
        console.log(err + 'ddm');
      })
  }

  const closeDialogDelete = () => {
    setIsDialogDeleteOpen(false);
    setDiscountIdToDelete('');
  }

  return (
    <div>
      <MaterialTable
        title="Rates"
        isLoading={isTableLoading}
        columns={columns}
        data={discounts}
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
              return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Discount</Button>;
            }

            return <MTableAction {...prevProps} />
          }
        }}
      />

      <DialogAddOrEditDiscount
        discountToEdit={discountToEdit}
        isOpen={isDialogAddOrEditOpen}
        onClose={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setDiscountToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setDiscountToEdit(null);
          }, 150);

          getAllDiscounts();
        }}
      />

      <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteDiscount(discountIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      />
    </div>
  );
}

export default PageDiscounts;