import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import moment from 'moment';
import * as reportAPI from '../../../api/reportAPI';

import MomentUtils from '@date-io/moment';
import { DatePicker , MuiPickersUtilsProvider } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

import moduleClasses from './PageReport.module.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }),
);

// const MyChart = (data: any) => {
//   return(
//     <div className={moduleClasses['chart']}>
//       <LineChart
//         width={500}
//         height={300}
//         data={rechartData}
//         margin={{
//           top: 5, right: 30, left: 20, bottom: 5,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis yAxisId="left" />
//         <YAxis yAxisId="right" orientation="right" />
//         <Tooltip />
//         <Legend />
//         <Line yAxisId="left" type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
//         <Line yAxisId="right" type="monotone" dataKey="uv" stroke="#82ca9d" />
//       </LineChart>
//     </div>
//   );
// }

const PageReport = () => {
  const [selectedDate, setSelectedDate] = useState(moment().toISOString());
  const [showedDate, setShowedDate] = useState(moment().toISOString());
  // const [chartData, setChartData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartView, setChartView] = useState('bar');
  const [isGettingReport, setIsGettingReport] = useState(false);
  const classes = useStyles();
  // const [selectedDate, setSelectedDate] = useState(new Date());

  // useEffect(() => {
  //   var array = $('#chart tspan').map(function(){ 
  //     return $(this).attr('textContent'); 
  //   });
  //   // console.log(array);
  //   $('tspan').each(function() {
  //     // console.log($(this)["0" : any].x);
  //   });
  // }, [chartData]);

  const getChartWidth = () => {
    // if (chartData.length < 7) {
    //   return chartData.length * 200;
    // }
    // else {
    //   return chartData.length * 100;
    // }
    return chartData.length > 8 ? 120 * chartData.length : 1000;
  }

  const getFormattedAxisTick = (tick: String) => {
    // movie name
    if (tick.length > 10) {
      return tick.substring(0, 10) + '...';
    }
    return tick;
  }

  const renderLineChart = () => (
    <LineChart
      // width={1000}
      width={getChartWidth()}
      height={400}
      data={chartData}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="movie"
        tickFormatter={(tick) => (getFormattedAxisTick(tick))}
        // dy={16}
        // // tickMargin={16}
        // height={40}
      />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend/>
      <Line yAxisId="left" type="monotone" dataKey="Income" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line yAxisId="right" type="monotone" dataKey="Showtimes" stroke="#82ca9d" />
    </LineChart>
  );

  const renderBarChart = () => (
    <BarChart
      width={getChartWidth()}
      height={400}
      data={chartData}
      margin={{
        top: 20, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="movie"
        tickFormatter={(tick) => (getFormattedAxisTick(tick))}
      />
      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="Income" fill="#8884d8" />
      <Bar yAxisId="right" dataKey="Showtimes" fill="#82ca9d" />
    </BarChart>
  );

  const renderChart = () => {
    switch (chartView) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      default:
        return renderLineChart();
    }
  }

  const onGetReportClick = () => {
    setIsGettingReport(true);
    reportAPI.getReportOfMonth(selectedDate)
    .then((res) => {
		console.log(res);
      var reportData = res.data.map((movieReport: any) => ({ 
        movie: movieReport.movie,
        Income: movieReport.totalPrice,
        Showtimes: movieReport.showtimes
      }));
      setChartData(reportData);
      setShowedDate(selectedDate);
      setIsGettingReport(false);
    })
    .catch((err) => {
      console.log(err);
      setIsGettingReport(false);
    })
    
  }

  return (
    <div style={{ position: 'relative' }}>
      {
        isGettingReport
        ? <div className={moduleClasses['overlay']}>
          <CircularProgress />
        </div>
        : null
      }
      <div 
        className='MuiPaper-root MuiPaper-elevation2 MuiPaper-rounded'
        style={{ position: 'relative'}}
      >
        <div 
          className='MuiToolbar-root MuiToolbar-regular MTableToolbar-root-318 MuiToolbar-gutters'
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px'
          }}
        >
          <div className='MTableToolbar-title-322'>
            <h6 className='MuiTypography-root MuiTypography-h6'>
              Report
            </h6>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label="Report Time"
                inputVariant="outlined"
                style={{ margin: 8 }}
                minDate={'2015-01-01'}
                // maxDate={moment().endOf('month')}
                maxDate={moment().add(1, "month")}
                margin="normal"
                format='MMMM YYYY'
                openTo="month"
                views={["year", "month"]}
                value={selectedDate}
                onChange={(date) => {
                  if (date) {
                    setSelectedDate(date.toISOString());
                  }
                }}
              />
            </MuiPickersUtilsProvider>
            {/* <Button size="large" color="primary">Get Report</Button> */}
            <Button
              variant="contained"
              size="large"
              color="primary"
              className={classes.margin}
              onClick={onGetReportClick}
            >
              Get Report
            </Button>
          </div>
        </div>
        {
          chartData.length > 0
          ? <div id="chart" className={moduleClasses['chart-container']}>
              <h2 
                style={{ color: '#009be5', textTransform: 'uppercase' }}
              >Income and Showtimes Report for {moment(showedDate.toString()).format('MMMM YYYY')}</h2>
              <ButtonGroup
                color="primary"
                aria-label="outlined primary button group"
                style={{ marginBottom: '16px' }}
              >
                <Button
                  variant={ (chartView === 'bar') ? "contained" : "outlined" }
                  onClick={() => { setChartView('bar') }}
                >Bar View</Button>
                <Button
                  variant={ (chartView === 'line') ? "contained" : "outlined" }
                  onClick={() => { setChartView('line') }}
                >Line View</Button>
              </ButtonGroup>
              {/* <MyResponsiveLine data={data}/> */}
              {/* <Chart /> */}
              {/* <MyResponsiveLine /> */}
              {/* <MyChart data={rechartData}/> */}
              { renderChart() }
            </div>
          : <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
              fontSize: '1rem',
              color: '#666' 
            }}>
            Choose Month and click "Get Report" to see Income And Showtimes Report
          </div>
        }
      </div>
    </div>
  );
}

export default PageReport;