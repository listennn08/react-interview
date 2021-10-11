import { ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { TextField, MenuItem } from '@material-ui/core'

import type { IState, IUser } from 'types'

type TProps = {
  label: string,
  value: any,
  changeHandler: (e: ChangeEvent<{ value: any }>) => void
  disabled?: boolean
}

const BaseUserSelector = ({ label, value, changeHandler, disabled = false }: TProps) => {
  const users = useSelector<IState, IUser[]>((state) => state.selectUsers)

  return (
    <TextField
      select
      name={label}
      id={label}
      variant="outlined"
      label={label}
      disabled={disabled}
      SelectProps={{
        multiple: true,
        value: value,
        onChange: changeHandler
      }}
    >
      {users.map((user) =>
        <MenuItem value={user.id} key={user.id}>{user.name}</MenuItem>)}
    </TextField>
  )
}

export default BaseUserSelector
