import React, {ChangeEvent, SyntheticEvent} from 'react';
import LineData from "../types/LineData";
import Role from "../types/Role";

interface Props {
  line: LineData;
  rolesInDialog: Role[];
  deleteLineInDialog: (line: LineData) => Promise<void>;
  updateLine: (line: LineData) => Promise<void>;
}

export const LineWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  return (
    <li>
      <form
        data-testid={"line-with-update-and-delete"}
        onSubmit={(event: SyntheticEvent) => {
          event.preventDefault();
        }}
      >
        <div>
          <label htmlFor={`line-role-${props.line.id}`}>Role</label>
          <select
            name="role"
            id={`line-role-${props.line.id}`}
            value={props.line.role.id}
            onChange={async (event: ChangeEvent<HTMLSelectElement>) => {
              await props.updateLine({
                ...props.line,
                role: {
                  ...props.line.role,
                  id: event.target.value,
                }
              });
            }}
          >
            {props.rolesInDialog.map((role) => {
              return <option value={role.id} key={role.id}>{role.name}</option>;
            })}
          </select>
        </div>
        <div>
          <label htmlFor={`line-text-${props.line.id}`}>Line Text</label>
          <input
            id={`line-text-${props.line.id}`}
            type={"text"}
            value={props.line.text}
            onChange={async (event: ChangeEvent<HTMLInputElement>) => {
              await props.updateLine({
                ...props.line,
                text: event.target.value,
              });
            }}
          />
        </div>
        <div>
          <label htmlFor={`line-number-${props.line.id}`}>Line Number</label>
          <input
            id={`line-number-${props.line.id}`}
            type={"number"}
            step={1}
            min={1}
            value={props.line.number}
            onChange={async (event: ChangeEvent<HTMLInputElement>) => {
              if (!(event.target.value === "")) {
                await props.updateLine({
                  ...props.line,
                  number: parseInt(event.target.value)
                });
              }
            }}
          />
        </div>
        <button
          type={"button"}
          onClick={async () => {
            await props.deleteLineInDialog(props.line);
          }}
        >
          Delete Line
        </button>
      </form>
    </li>
  );
};
