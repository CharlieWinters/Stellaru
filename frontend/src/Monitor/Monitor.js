import React from 'react';
import {useState, useEffect} from 'react';

import {Tabs, Tab} from '@material-ui/core';
import TabPanel from './TabPanel';

import LineChart from './Charts/LineChart';
import {selectNested} from './Charts/Util';

import './Monitor.css';

function StatusIndicator(props) {
    const status = props.status[0].toUpperCase() + props.status.slice(1).toLowerCase();
    let sclass = 'statusIndicatorError';
    if (status === 'Waiting')
        sclass = 'statusIndicatorGood';
    else if (status === 'Loading')
        sclass = 'statusIndicatorLoading';
    return (
        <div className='statusIndicator'>
            <div className={sclass}>
                <h2 className={sclass+'Text'}>{status}</h2>
            </div>
        </div>
    );
}

function Monitor(props) {
    const save = props.save;
    const empire = props.empire;
    const subscription = props.socket;

    const [gameData, setGameData] = useState([]);
    const [status, setStatus] = useState(subscription.readyState === 1 ? 'WAITING' : 'Disconnected');
    const [currentTab, setCurrentTab] = useState(0);

    const onNewData = (event) => {
        const data = JSON.parse(event.data);
        if ('snap' in data) {
            let snaps = gameData.slice();
            snaps.push(data['snap']);
            setGameData(snaps);
        }
        else if ('status' in data)
            setStatus(data['status']);
    };
    subscription.onmessage = onNewData;
    subscription.onerror = () => setStatus('Error');
    subscription.onclose = () => setStatus('Disconnected');

    useEffect(() => {
        fetch(
            'api/data', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({empire: empire.id, file: save.file})
            }
        ).then(response => response.json()).then(data => {
            setGameData(data['snaps']);
        });
    }, [save, empire]);

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-3'></div>
                <div className='col-6'>
                    <h1 className='empireName'>
                        {empire.name}<span className='playerName'>({empire.player})</span>
                    </h1>
                </div>
                <div className='col-1'></div>
                <div className='col-2'>
                    <StatusIndicator status={status}/>
                </div>
            </div>
            <Tabs value={currentTab} onChange={(_, newTab) => setCurrentTab(newTab)}>
                <Tab label='Overview'/>
                <Tab label='Economy'/>
                <Tab label='Military'/>
                <Tab label='Science'/>
                <Tab label='Construction'/>
                <Tab label='Society'/>
            </Tabs>
            <TabPanel value={currentTab} index={0}>
                <div className='row'>
                    <div className='col-4'>
                        <LineChart
                            data={gameData}
                            height={200}
                            title='Net Resource Incomes'
                            titleColor='#e8db27'
                            yAxisLabel='Net Income'
                            lines={[
                                {
                                    label: 'Energy Credits',
                                    selector: snap => selectNested('economy/net_income/energy', snap)
                                },
                                {
                                    label: 'Minerals',
                                    selector: snap => selectNested('economy/net_income/minerals', snap)
                                }
                            ]}
                        />
                    </div>
                </div>
            </TabPanel>
        </div>
    );
}

export default Monitor;
