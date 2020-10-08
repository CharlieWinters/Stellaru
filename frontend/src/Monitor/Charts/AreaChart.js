import React from 'react';

import ComposedChart from './ComposedChart';
import {getDataColors, renderArea} from './Util';

function AreaChart(props) {
    const name = props.name;
    const rawData = props.data;
    const areas = props.areas;
    const yLabel = props.yAxisLabel ? props.yAxisLabel : null;
    const rightYLabel = props.rightYLabel ? props.rightYLabel : null;
    const labelColors = getDataColors(areas.map(area => area.label));
    const allowIsolation = props.allowIsolation ? true : false;
    const areaClickCb = props.onAreaClick;
    const stack = props.stack ? true : false;

    const renderAreaBound = area => renderArea(area, labelColors[area.label], stack ? '1' : null);

    return (
        <ComposedChart
            name={name}
            data={rawData}
            series={areas}
            yAxisLabel={yLabel}
            rightYLabel={rightYLabel}
            allowIsolation={allowIsolation}
            onSeriesClick={areaClickCb}
            seriesRenderer={renderAreaBound}
            labelColors={labelColors}
        />
    );
}

export default AreaChart;
