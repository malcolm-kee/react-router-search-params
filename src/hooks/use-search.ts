import * as qs from 'qs';
import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

const encoder: qs.IStringifyBaseOptions['encoder'] = (str, defaultEncoder, charset, type) => {
  if (type === 'value') {
    switch (typeof str) {
      case 'boolean':
        return defaultEncoder(`bool:${str}`, defaultEncoder, charset);

      case 'number':
        return defaultEncoder(`num:${str}`, defaultEncoder, charset);

      default:
        return defaultEncoder(str, defaultEncoder, charset);
    }
  }
  return defaultEncoder(str, defaultEncoder, charset);
};

const decoder: qs.IParseBaseOptions['decoder'] = (str, defaultDecoder, charset, type) => {
  if (type === 'value') {
    const decodedStr = defaultDecoder(str, defaultDecoder, charset);

    if (/^bool:(true|false)$/.test(decodedStr)) {
      return decodedStr === 'bool:true';
    }
    if (/^num:/.test(decodedStr)) {
      const numStr = decodedStr.replace(/^num:/, '');

      if (+numStr * 0 === 0 && +numStr + '' === numStr) {
        return +numStr;
      }
    }
  }

  return defaultDecoder(str, defaultDecoder, charset);
};

export const useSearch = <T extends object>({ initial }: { initial?: Partial<T> }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = React.useMemo(() => {
    return qs.parse(searchParams.toString(), { decoder }) as unknown as Partial<T>;
  }, [searchParams]);

  const setValue = (nextValue: Partial<T>) => {
    setSearchParams(
      (prev) => {
        const prevValue = qs.parse(prev.toString(), { decoder });

        const updatedValue: Record<string, any> = { ...prevValue, ...nextValue };

        return qs.stringify(updatedValue, { encoder });
      },
      { replace: true }
    );
  };

  React.useEffect(() => {
    if (initial) {
      const initialKeys = Object.keys(initial);
      const currentValueKeys = Object.keys(value);

      if (initialKeys.every((key) => !currentValueKeys.includes(key))) {
        setValue(initial);
      }
    }
  }, []);

  return [value, setValue] as const;
};
