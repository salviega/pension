import "./PensionRegister.scss";
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PensionRegister() {
  const { isRegisted, isVerified } = useSelector(({ auth }) => auth);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.target.value);
  };

  if (!isVerified || !isRegisted) return <Navigate replace to="/" />;
  return (
    <React.Fragment>
      <h2>Get your pension</h2>
      <div class="container">
        <form onSubmit={handleSubmit}>
          <div class="row">
            <div class="col-half">
              <h4>Date of Birth</h4>
              <div class="input-group">
                <div class="col-third">
                  <input type="text" placeholder="DD" />
                </div>
                <div class="col-third">
                  <input type="text" placeholder="MM" />
                </div>
                <div class="col-third">
                  <input type="text" placeholder="YYYY" />
                </div>
              </div>
            </div>
            <div class="col-half">
              <h4>Gender</h4>
              <div class="input-group">
                <input
                  id="gender-male"
                  type="radio"
                  name="gender"
                  value="male"
                />
                <label for="gender-male">Male</label>
                <input
                  id="gender-female"
                  type="radio"
                  name="gender"
                  value="female"
                />
                <label for="gender-female">Female</label>
              </div>
            </div>
          </div>
          <div class="row">
            <h4>Insert your first deposite</h4>
            <div class="input-group input-group-icon">
        <input type="text" placeholder="Greater than or equal to $25 wei"/>
        </div>
            <div class="input-group">
              <input id="terms" type="checkbox" />
              <label class="space" for="terms">
                Not your keys, not your coins
              </label>
            </div>
          <button type='submit' class="button-summit">
            Crear
          </button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export { PensionRegister };
