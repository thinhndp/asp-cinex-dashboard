import React, { useState, FunctionComponent, useEffect } from 'react';

// Component
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormLabel from '@material-ui/core/FormLabel';

interface ICheckboxOption {
  optionVal: any,
  isSelected: boolean,
}

interface ICheckboxGroupProps {
  options: Array<any>,
  fieldValue: any,
  fieldLabel: string,
  selectedValues: Array<any>,
  onChange: Function,
}

const CheckboxGroup: FunctionComponent<ICheckboxGroupProps> = (props) => {
  const [checkboxOptions, setCheckboxOptions] = useState<Array<ICheckboxOption>>([]);

  useEffect(() => {
    const tmpCheckboxOptions = props.options.map(x => {
      return {
        optionVal: x,
        isSelected: props.selectedValues ? props.selectedValues.includes(x[props.fieldValue]) : false,
      };
    });
	setCheckboxOptions(tmpCheckboxOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedValues]);

  const emitOnChangeValue = (newCheckboxOptions: Array<ICheckboxOption>) => {
    const newSelectedValue = newCheckboxOptions
      .filter(checkboxOption => {
        return checkboxOption.isSelected === true;
      })
      .map(checkboxOption => {
        return checkboxOption.optionVal[props.fieldValue];
      });

    props.onChange(newSelectedValue);
  }

  const renderScreenTypeCheckboxes = () => {
    return (
      <div style={{display: 'flex',}}>
        {checkboxOptions.map(option => (
          <FormControlLabel
            key={option.optionVal[props.fieldValue]}
            control={
              <Checkbox
                checked={option.isSelected}
                onChange={(event, checked) => {
                  const tmpCheckboxOptions = [...checkboxOptions];
                  const foundIndex = tmpCheckboxOptions.findIndex(x => x.optionVal[props.fieldValue] === option.optionVal[props.fieldValue]);
                  tmpCheckboxOptions[foundIndex] = {...option, isSelected: checked };
                  setCheckboxOptions(tmpCheckboxOptions);
                  emitOnChangeValue(tmpCheckboxOptions);
                }}
                color="primary"
              />
            }
            label={option.optionVal[props.fieldLabel]}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      {renderScreenTypeCheckboxes()}
    </>
  );
}

export default CheckboxGroup;