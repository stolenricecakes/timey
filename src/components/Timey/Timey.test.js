import { render, screen } from '@testing-library/react';
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Timey from './Timey';

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
   const mockTimes = [
    {startTime : new Date(), endTime : new Date(), continuation: true},
    {startTime : new Date(), endTime : new Date(), continuation: true}
   ]

   act(() => {
    render(<Timey />, container);
   });

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
  expect(tableRows.length).toEqual(1);

  //const tableRowsContinuations = document.querySelectorAll(".time-log-container table tbody tr.continuation");
  //expect(tableRows.length).toEqual(0);
});