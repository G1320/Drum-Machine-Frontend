import '../styles/read.css';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';

import { getUsers, deleteUser } from '../services/user-service';

export default function Read() {
  const [APIData, setAPIData] = useState([]);
  const [loading, setLoading] = useState(true);

  const setData = (data) => {
    let { _id, username, email, firstName, lastName, avatar, role } = data;
    localStorage.setItem('ID', _id);
    localStorage.setItem('Username', username);
    localStorage.setItem('Email', email);
    localStorage.setItem('First Name', firstName);
    localStorage.setItem('Last Name', lastName);
    localStorage.setItem('Avatar', avatar);
    localStorage.setItem('Role', role);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setAPIData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDelete = async (id) => {
    try {
      await deleteUser(id);
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Update</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {APIData.map((data) => {
                return (
                  <TableRow key={data._id}>
                    <TableCell>{data.username}</TableCell>
                    <TableCell>{data.email}</TableCell>
                    <TableCell>{data.firstName}</TableCell>
                    <TableCell>{data.lastName}</TableCell>
                    {/* <TableCell>
                      <img src={data.avatar} alt="avatar" height="40" />
                    </TableCell> */}
                    <TableCell>{data.role}</TableCell>
                    <TableCell>
                      <Link to="/update">
                        <Button onClick={() => setData(data)} variant="contained">
                          Update
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => onDelete(data._id)} variant="contained">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
