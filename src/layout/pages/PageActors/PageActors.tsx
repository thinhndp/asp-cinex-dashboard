import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as actorAPI from '../../../api/actorAPI';

// Interface
import { Actor } from '../../../interfaces/actor';

// Component
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import MaterialTable, { Column, MTableAction } from 'material-table';

// Custom Component
import DialogAddOrEditActor from './components/DialogAddOrEditActor';
import DialogYesNo from '../../../components/DialogYesNo';

// Class
// import classes from './PageActors.module.scss';

const PageActors: FunctionComponent = () => {
  const [actors, setActors] = useState<Array<Actor>>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Add or edit Dialog
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  const [actorToEdit, setActorToEdit] = useState<Actor | null>(null);
  // Delete Dialog
  const [actorIdToDelete, setActorIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<Actor>> = [
    { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    { title: 'Name', field: 'name' },
    {
      title: 'Avatar',
      field: 'avatar',
      render: (rowData) => {
        // const endAtDisplay = moment(rowData.endAt).format('DD/MM/YYYY');
        return (
          <img
            src={rowData.avatar ? rowData.avatar : 'https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg'}
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
          />
        )
      },
    },
  ]

  useEffect(() => {
    getAllActors();
  }, []);

  const getAllActors = () => {
    setIsTableLoading(true);
    actorAPI.getAllActors()
      .then(response => {
        setIsTableLoading(false);
        setActors(response.data);
      })
      .catch(err => {
        setIsTableLoading(false);
        console.log(err);
      })
  }

  const onAddClick = () => {
    setIsDialogAddOrEditOpen(true);
  }

  const onUpdateClick = (event: any, actor: any) => {
    setActorToEdit(actor);
    setIsDialogAddOrEditOpen(true);
  }
  
  const onDeleteClick = (event: any, actor: any) => {
    setIsDialogDeleteOpen(true);
    setActorIdToDelete(actor.id);
  }

  const deleteActor = (id: string) => {
    setIsLoadingDelete(true);
    actorAPI.deleteActor(id)
      .then((response) => {
        setIsLoadingDelete(false);
        closeDialogDelete();
        getAllActors();
      })
      .catch((err) => {
        setIsLoadingDelete(false);
        console.log(err + 'ddm');
      })
  }

  const closeDialogDelete = () => {
    setIsDialogDeleteOpen(false);
    setActorIdToDelete('');
  }

  return (
    <div>
      <MaterialTable
        title="Actors"
        isLoading={isTableLoading}
        columns={columns}
        data={actors}
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
              return <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{marginLeft: '20px'}} onClick={() => onAddClick()}>Add Actor</Button>;
            }

            return <MTableAction {...prevProps} />
          }
        }}
      />

      <DialogAddOrEditActor
        actorToEdit={actorToEdit}
        isOpen={isDialogAddOrEditOpen}
        onClose={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setActorToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setActorToEdit(null);
          }, 150);

          getAllActors();
        }}
      />

      <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteActor(actorIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      />
    </div>
  );
}

export default PageActors;