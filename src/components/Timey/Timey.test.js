import { render } from '@testing-library/react';
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {DarkModeProvider} from "../DarkModeContext";
import * as logic from "./logic";
import Timey from './Timey';

jest.mock("./logic");
jest.mock("../../functions/timeCalcs.js");

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('when deleting a row, leave the one before it not marked as continuation.', () => {
    logic.toggleWorkingState
        .mockImplementationOnce(() => ({working:true, times: [{startTime : new Date(), continuation : false}]}))
        .mockImplementationOnce(() => ({working:false, times: [{startTime : new Date(), endTime: new Date(), continuation : true}]}))
        .mockImplementationOnce(() => ({working:true, times: [
            {startTime : new Date(), endTime: new Date(), continuation : true},
            {startTime : new Date(), continuation : false}
        ]}))
        .mockImplementationOnce(() => ({working:false, times: [
            {startTime : new Date(), endTime: new Date(), continuation : true},
            {startTime : new Date(), endTime: new Date(), continuation : true}
        ]}));

    logic.deleteEntry
        .mockImplementationOnce(() => ({times: [{startTime: new Date(), endTime: new Date(), continuation: false}]}))

    logic.workingTimeTick.mockReturnValue({times: []});
    render(<DarkModeProvider><Timey /></DarkModeProvider>, container);

  // get a hold of the button element, and trigger some clicks on it
  const button = document.querySelector(".button-container button:first-child");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true })); // start
  });

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true })); // stop
  });
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true })); // start
  });

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true })); // stop
  });

  const deleteButtons = document.querySelectorAll("button.delete-entry");
  const lastDeleteButton = deleteButtons[1];
  
  act(() => {
    lastDeleteButton.dispatchEvent(new MouseEvent("click", { bubbles: true}));
  });

  const tableRows = document.querySelectorAll(".time-log-container table tbody tr");
  expect(tableRows.values().next().done).toEqual(true);

});