import React from "react";
import { useParams } from "react-router-dom";

export default function Diet() {
  const { id } = useParams();

  return <div>Diet</div>;
}
