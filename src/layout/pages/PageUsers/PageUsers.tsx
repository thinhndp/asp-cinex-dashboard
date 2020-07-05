import React, { useEffect, useState, FunctionComponent } from 'react';

// Misc
import * as userAPI from '../../../api/userAPI';

// Interface
import { User, Role } from '../../../interfaces/user';

// Component
import MaterialTable, { Column, } from 'material-table';
import Paper from '@material-ui/core/Paper';

// Custom Component
import DialogAddOrEditUser from './components/DialogAddOrEditUser';
import TableRoleInfo from '../../../components/TableRoleInfo';
// import DialogYesNo from '../../../components/DialogYesNo';

// Class
// import classes from './PageUsers.module.scss';

const ROLES: Array<Role> = [
  {
    id: 1,
    role: "Admin",
  },
  {
    id: 3,
    role: "Staff",
  },
]

const PageUsers: FunctionComponent = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  // Add or edit Dialog
  const [isDialogAddOrEditOpen, setIsDialogAddOrEditOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  // // Delete Dialog
  // const [userIdToDelete, setUserIdToDelete] = useState(''); // TODO: Find out if we need to make this a state
  // const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  // const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  
  const columns: Array<Column<User>> = [
    { title: 'Id', field: 'id', editable: 'never', cellStyle: {width: '300px'} },
    { title: 'Username', field: 'username' },
    {
      title: 'Roles',
      field: 'roles',
      render: (rowData) => {
        const roleStrList = rowData.roles.map(role => role.role).filter(roleStr => roleStr === 'Admin' || roleStr === 'Staff');
        const roleStrCapitalizedList = roleStrList.map(roleStr => roleStr.charAt(0).toUpperCase() + roleStr.slice(1))
        const roleToDisplay = roleStrCapitalizedList.join(', ');
        return (<span>{roleToDisplay}</span>)
      }
    },
    // { title: 'Minimum Age Allowed', field: 'minAge' },
  ]

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    setIsTableLoading(true);
    userAPI.getAllUsers()
      .then(response => {
        setIsTableLoading(false);
        setUsers(response.data);
      })
      .catch(err => {
        setIsTableLoading(false);
        console.log(err);
      })
  }

  // const onAddClick = () => {
  //   setIsDialogAddOrEditOpen(true);
  // }

  const onUpdateClick = (event: any, user: any) => {
    setUserToEdit(user);
    setIsDialogAddOrEditOpen(true);
  }
  
  // const onDeleteClick = (event: any, user: any) => {
  //   setIsDialogDeleteOpen(true);
  //   setUserIdToDelete(user.id);
  // }

  // const deleteUser = (id: string) => {
  //   setIsLoadingDelete(true);
  //   userAPI.deleteUser(id)
  //     .then((response) => {
  //       setIsLoadingDelete(false);
  //       closeDialogDelete();
  //       getAllUsers();
  //     })
  //     .catch((err) => {
  //       setIsLoadingDelete(false);
  //       console.log(err + 'ddm');
  //     })
  // }

  // const closeDialogDelete = () => {
  //   setIsDialogDeleteOpen(false);
  //   setUserIdToDelete('');
  // }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', marginBottom: '12px', color: '#555', fontSize: '16px', }}>
        <Paper style={{ padding: 20, width: "100%" }}>
          <div style={{ fontWeight: 'bold', fontSize: 22, color: '#333', }}>Permissions</div>
          <div style={{ padding: 10, }}>
            <TableRoleInfo />
          </div>
        </Paper>
      </div>

      <MaterialTable
        title="Users"
        isLoading={isTableLoading}
        columns={columns}
        data={users}
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
          // { icon: 'delete', tooltip: 'Delete', onClick: (event, rowData) => onDeleteClick(event, rowData) },
          // { icon: 'add', tooltip: 'Add', onClick: () => {}, isFreeAction: true }, // Will be overrided right below
        ]}
      />

      <DialogAddOrEditUser
        userToEdit={userToEdit}
        roleList={ROLES}
        isOpen={isDialogAddOrEditOpen}
        onClose={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setUserToEdit(null);
          }, 150);
        }}
        onSave={() => {
          setIsDialogAddOrEditOpen(false);

          // TODO: Fix this
          setTimeout(() => {
            setUserToEdit(null);
          }, 150);

          getAllUsers();
        }}
      />

      {/* <DialogYesNo
        isOpen={isDialogDeleteOpen}
        isLoadingYes={isLoadingDelete}
        onYes={() => {deleteUser(userIdToDelete);}}
        onNo={() => {closeDialogDelete();}}
        onClose={() => {closeDialogDelete();}}
      /> */}
    </div>
  );
}

export default PageUsers;