import "./PensionMyPensions.scss";
import React from "react";
import { useParams } from 'react-router-dom';

function PensionMyPensions() {
  const{ address } = useParams()
  return <h1>{'pension from: ' + address}</h1>;
}

export { PensionMyPensions };
