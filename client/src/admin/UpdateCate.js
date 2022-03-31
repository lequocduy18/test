import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import { getCategories, updateCate } from './apiAdmin';

const UpdateCate = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    loading: false,
    error: false,
    createdCate: '',
    formData: '',
    redirectToProfile : false
  });
  const [categories, setCategories] = useState([]);

  const { user, token } = isAuthenticated();
  const {
    name,
    loading,
    error,
    createdCate,
    formData,
    redirectToProfile,
  } = values;

  const init = (CateId) => {
    getCategories(CateId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // populate the state
        setValues({
          ...values,
          name: data.name,
          formData: new FormData(),
        });
        // load categories
        initCategories();
      }
    });
  };
  // const handleChange = (name) => (event) => {
  //   const value = name === 'photo' ? event.target.files[0] : event.target.value;
  //   formData.set(name, value);
  //   setValues({ ...values, [name]: value });
  // };
  // load categories and set form data
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    init(match.params.CateId);
  }, []);
  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    formData.set(name,value);
    setValues({ ...values});
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });

    updateCate(match.params.CateId, user._id, token,formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: '',
            loading: false,
            error: false,
            redirectToProfile: true,
            createdCate: data.name,
          });
        }
      }
    );
  };

  const newPostForm = () => (
    <form className='mb-3' onSubmit={clickSubmit}>

      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={handleChange('name')}
          type='text'
          className='form-control'
          value={name}
        />
      </div>


      <button className='btn btn-outline-primary'>Update Category</button>
    </form>
  );

  const showError = () => (
    <div
      className='alert alert-danger'
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className='alert alert-info'
      style={{ display: createdCate ? '' : 'none' }}
    >
      <h2>{`${createdCate}`} is updated!</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className='alert alert-success'>
        <h2>Loading...</h2>
      </div>
    );
    const redirectUser = () => {
      if (redirectToProfile) {
        if (!error) {
          return <Redirect to='/' />;
        }
      }
    };
    const goBack = () => (
      <div className='mt-5'>
        <Link to='/admin/dashboard' className='text-warning'>
          Back to Dashboard
        </Link>
      </div>
    );

  return (
    <Layout
      title='Add a new category'
      description={`G'day ${user.name}, ready to add a new Category?`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateCate;
