import React from 'react'
import { useParams } from 'react-router-dom';

function Competition() {

  const { competition, category } = useParams();

  return (
    <div>{ competition + ' - ' + category }</div>
  )
}

export default Competition