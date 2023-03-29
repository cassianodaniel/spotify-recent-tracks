import React, { useCallback } from 'react';
import { DebounceInput } from 'react-debounce-input';
import classNames from 'classnames';
import styles from '../scss/components/Input.module.scss';

/**
 * @property {String} value - The value of the input
 * @property {Function} setValue - The function to set the value of the input
 * @property {string} placeholder - The placeholder of the input
 * @property {string | undefined} customClassName - The custom class of the input
 * @property {string} type - The custom type of the input
 */
const Input = ({
  value,
  setValue,
  placeholder,
  type = "text",
  customClassName
}) => {
  const handleInputChange = useCallback(({ target }) => {
    setValue(target.value);
  }, [setValue]);

  return (
    <DebounceInput
      aria-label={placeholder}
      aria-describedby="search-input"
      debounceTimeout={value.length > 0 ? 300 : 0}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => handleInputChange(event)}
      className={classNames({
        "rounded-pill": true,
        [styles["debounce-input"]]: true,
        [customClassName]: customClassName,
        [styles.black]: value.length === 0,
        [styles.blue]: value.length > 0,
      })}
    />
  )
};

export default Input;