import * as React from 'react';

export const Input = (props: React.ComponentPropsWithoutRef<'input'>) => (
  <input className="border border-gray-200 rounded" {...props} />
);
