import './PensionRegister.scss';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PensionRegister() {
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.target.value);
  };

  if (isVerified || !isRegisted) return <Navigate replace to="/" />;
  return (
    <>
      <h2>Get your pension</h2>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-half">
              <h4>Date of Birth</h4>
              <div className="input-group">
                <div className="col-third">
                  <input type="text" placeholder="DD" />
                </div>
                <div className="col-third">
                  <input type="text" placeholder="MM" />
                </div>
                <div className="col-third">
                  <input type="text" placeholder="YYYY" />
                </div>
              </div>
            </div>
            <div className="col-half">
              <h4>Gender</h4>
              <div className="input-group">
                <input id="gender-male" type="radio" name="gender" value="male" />
                <label htmlFor="gender-male">Male</label>
                <input id="gender-female" type="radio" name="gender" value="female" />
                <label htmlFor="gender-female">Female</label>
              </div>
            </div>
          </div>
          <div className="row">
            <h4>Insert your first deposite</h4>
            <div className="input-group input-group-icon">
              <input type="text" placeholder="Greater than or equal to $25 wei" />
            </div>
            <div className="input-group">
              <input id="terms" type="checkbox" />
              <label className="space" htmlFor="terms">
                Not your keys, not your coins
              </label>
            </div>
            <button type="submit" className="button-summit">
              Crear
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export { PensionRegister };
