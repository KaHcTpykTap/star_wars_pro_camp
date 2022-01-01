import React from 'react';

const BarChat = ({data}: any) => {

    const expensesData = data;
    const maxExpense = 450;
    const chartHeight = maxExpense + 20;
    const barWidth = 50*3;
    const barMargin = 30;
    const numberofBars = expensesData.length;
    let width = numberofBars * (barWidth + barMargin);

    const Chart = ({ children, width, height }: any) => (
        <svg
            viewBox={`0 0 ${width} ${height + 30}`}
            width="100%"
            height="50vh"
            preserveAspectRatio="xMidYMax meet"
        >
            {children}
        </svg>
    );

    const Bar = ({ x, y, width, height, expenseName}: any) => (
        <>
            <text x={x + width / 4} y={y + height+20}>
                {`${expenseName}`}
            </text>
            <rect x={x} y={y} width={width} height={height} fill={`#515bd4`} />
            <text x={x + width / 4} y={y - 5}>
                {`${height * 10000000}`}
            </text>
        </>
    );

    return (
            <Chart height={chartHeight} width={width}>
                {expensesData.map((data: { expense: any; name: any; }, index: number) => {
                    const barHeight = data.expense;
                    return (
                        <Bar
                            key={data.name}
                            x={index * (barWidth + barMargin)}
                            y={chartHeight - barHeight}
                            width={barWidth}
                            height={barHeight}
                            expenseName={data.name}
                        />
                    );
                })}
            </Chart>
    );
}

export default BarChat;