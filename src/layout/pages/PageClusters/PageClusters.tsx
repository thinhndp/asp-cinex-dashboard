import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as clusterAPI from '../../../api/clusterAPI';

// Interface
import { Cluster } from '../../../interfaces/cluster';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import DialogAddOrEditCluster from './components/DialogAddOrEditCluster';
import DialogYesNo from '../../../components/DialogYesNo';

// Class
// import classes from './PageClusters.module.scss';

const PageClusters: FunctionComponent = () => {
  const [clusters, setClusters] = useState<Array<Cluster>>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Add or edit Dialog
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  const [clusterToEdit, setClusterToEdit] = useState<Cluster | null>(null);
  // Delete Dialog
  const [clusterIdToDelete, setClusterIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<Cluster>> = [
    { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    { title: 'Name', field: 'name' },
    { title: 'Address', field: 'address' },
  ]

  useEffect(() => {
    getAllClusters();
  }, []);

  const getAllClusters = () => {
    setIsTableLoading(true);
    clusterAPI.getAllClusters()
      .then(response => {
        setIsTableLoading(false);
        setClusters(response.data);
      })
      .catch(err => {
        setIsTableLoading(false);
        console.log(err);
      })
  }

  const onAddClick = () => {
    setIsDialogAddOrEditOpen(true);
  }

  const onUpdateClick = (event: any, cluster: any) => {
    setClusterToEdit(cluster);
    setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, cluster: any) => {
    setIsDialogDeleteOpen(true);
    setClusterIdToDelete(cluster.id);
  }

  const deleteCluster = (id: string) => {
    setIsLoadingDelete(true);
    clusterAPI.deleteCluster(id)
      .then((response) => {
        setIsLoadingDelete(false);
        closeDialogDelete();
        getAllClusters();
      })
      .catch((err) => {
        setIsLoadingDelete(false);
        console.log(err + 'ddm');
      })
  }

  const closeDialogDelete = () => {
    setIsDialogDeleteOpen(false);
    setClusterIdToDelete('');
  }

  return (
    <div>
      <MaterialTable
        title="Clusters"
        isLoading={isTableLoading}
        columns={columns}
        data={clusters}
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
              return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Cluster</Button>;
            }

            return <MTableAction {...prevProps} />
          }
        }}
      />

      <DialogAddOrEditCluster
        clusterToEdit={clusterToEdit}
        isOpen={isDialogAddOrEditOpen}
        onClose={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setClusterToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setClusterToEdit(null);
          }, 150);

          getAllClusters();
        }}
      />

      <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteCluster(clusterIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      />
    </div>
  );
}

export default PageClusters;