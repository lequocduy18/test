import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { getCategories, deleteCate } from './apiAdmin';

const ManageCate = () => {
  const [categories, setCategories] = useState([]);

  const { user, token } = isAuthenticated();

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const destroy = (CateId) => {
    deleteCate(CateId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadCategories();
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Layout
      title='Manage categories'
      description='Perform CRUD on categories'
      className='container-fluid'
    >
      <div className='row'>
        <div className='col-12'>
          <h2 className='text-center'>Total {categories.length} Category</h2>
          <hr />
          <ul className='list-group'>
            {categories.map((p, i) => (
              <li
                key={i}
                className='list-group-item d-flex justify-content-between align-items-center'
              >
                <strong>{p.name}</strong>
                <Link to={`/admin/category/update/${p._id}`}>
                  <span className='badge badge-warning badge-pill'>Update</span>
                </Link>
                <Link>
                  <span
                    onClick={() => destroy(p._id)}
                    className='badge badge-danger badge-pill'
                  >
                    Delete
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ManageCate;
