import styled from "styled-components";
import { Chart } from "react-google-charts";

export const StyledChart = styled(Chart)`
  svg > g:nth-child(1) > path {
    fill: white;
    stroke: pink;
  }
  svg > g:nth-child(2) > path {
    fill: white;
  }

  svg > g:nth-child(2) > g > text {
    fill: white;
  }
`;

export const PieChartContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //background-color: red;
`;

export const PieChartControlsDiv = styled.div`
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  width: 100%;
  padding-top: 10px;
  // background-color: red;
  @media (max-width: 530px) {
    flex-direction: column;
  }
`;

export const ValueControlDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 20%;
  height: 100px;
  //background-color: blue;
  padding: 20px;
  margin-top: 10px;

  .google-visualization-controls-slider-handle {
    background-color: white;
  }
  .google-visualization-controls-slider-thumb {
    background-color: green;
  }
  .google-visualization-controls-slider-thumb {
    background-color: #51d289;
    width: 8px;
    border: none;
  }
  .google-visualization-controls-rangefilter-thumblabel {
    color: #51d289;
  }
  @media (max-width: 530px) {
    height: fit-content;
  }

  // background-color: pink;
`;

export const CategoryControlDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  height: 100px;
  //border: solid 1px #ccc;
  padding: 20px;
  margin-top: 10px;
  //background-color: pink;
  @media (max-width: 530px) {
    height: 35px;
    width: 100%;
    margin-bottom: 15px;
  }
`;
