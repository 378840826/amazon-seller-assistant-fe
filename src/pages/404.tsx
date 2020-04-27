import React from 'react';

const My: React.FC = function() {
  const lo = localStorage.a;
  const msg = 0;
  const o = { a: 0, b: 1 };
  const { a } = o;
  return (
    <div>
      404
      <h1>{msg}{a}{lo}</h1>
    </div>
  );
};

export default My;
