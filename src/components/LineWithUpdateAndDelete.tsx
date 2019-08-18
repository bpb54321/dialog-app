import React, {ChangeEvent, SyntheticEvent} from 'react';
import LineData from "../types/LineData";
import Role from "../types/Role";
import styles from "../css/shared.module.css";

export enum LineDirection {
  Up,
  Down,
}

interface Props {
  line: LineData;
  rolesInDialog: Role[];
  deleteLineInDialog: (line: LineData) => Promise<void>;
  updateLine: (line: LineData) => Promise<void>;
  changeLineOrder: (line: LineData, direction: LineDirection) => Promise<void>;
  hasMoveLineUpButton: boolean;
  hasMoveLineDownButton: boolean;
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
          <textarea
            id={`line-text-${props.line.id}`}
            value={props.line.text}
            className={styles.wideTextInput}
            onChange={async (event: ChangeEvent<HTMLTextAreaElement>) => {
              await props.updateLine({
                ...props.line,
                text: event.target.value,
              });
            }}
          />
        </div>
        <div>
          {
            props.hasMoveLineUpButton ?
              <button
                onClick={async () => {
                  await props.changeLineOrder(props.line, LineDirection.Up);
                }}
              >
                Move Line Up
              </button> :
              null
          }
          {
            props.hasMoveLineDownButton ?
              <button
                onClick={async () => {
                  await props.changeLineOrder(props.line, LineDirection.Down);
                }}
              >
                Move Line Down
              </button> :
              null
          }
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
