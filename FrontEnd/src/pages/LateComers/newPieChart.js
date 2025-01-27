import React from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

const PieChart = (props) => {
    const { Data } = props;
    console.log(Data[0])

    const dataColumns = Data
        ? [
            ["Male", Data[0].Male],
            ["Female", Data[0].Female]
        ]
        : [
            ["Male", 0],
            ["Female", 0]
        ];

    const data = {
        columns: dataColumns,
        type: "pie",
    };

    const color = { pattern: ["#3a0ca3", "#8d99ae"] };
    const pie = {
        label: { show: false }
    };
    const tooltip = {
        format: {
            value: function (value, ratio, id) {
                return value; // Return the actual value (count) instead of percentage
            }
        }
    };

    return (
        <>
            <h1 style={{ display: 'flex', justifyContent: 'center' }}>{"Gender Wise"}</h1>
            <C3Chart data={data} pie={pie} color={color} tooltip={tooltip}/>
        </>
    );
};

export default PieChart;
