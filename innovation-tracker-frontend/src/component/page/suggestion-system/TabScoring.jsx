import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Label from './Label';
import SearchDropdown from '../../part/SearchDropdown';

function TabScoring(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabScoring.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabsWithData() {
  const [value, setValue] = React.useState(0);
  const [listKriteriaPenilaian, setListKriteriaPenilaian] = React.useState([]);
    const [listDetailKriteriaPenilaian, setListDetailKriteriaPenilaian] =
      useState([]);
  const formDataRef2 = React.useRef({});

  const totalScore = 100; 

  const handleInputChange = (e) => {
    formDataRef2.current[e.target.name] = e.target.value;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {listKriteriaPenilaian.map((item, index) => (
            <Tab key={item.Value} label={item.Text} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>

      {listKriteriaPenilaian.map((item, index) => {
        const filteredArrData = listDetailKriteriaPenilaian.filter(
          (detail) => detail.Id === item.Value
        );

        return (
          <TabScoring key={item.Value} value={value} index={index}>
            <div className="row mb-3">
              <div className="col-lg-4">
                <Label data={item.Text} />
              </div>
              <div className="col-lg-8">
                <SearchDropdown
                  forInput={item.Value}
                  arrData={filteredArrData}
                  isRound
                  value={formDataRef2.current[item.Value] || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="ps-4" style={{ width: "20%" }}>
              <div
                className="d-flex flex-column gap-3"
                style={{ height: "100px" }}
              >
                <div
                  className="card fw-medium text-center"
                  style={{ width: "200px", minHeight: '155px' }}
                >
                  Ka.Unit/Ka.UPT
                  <hr />
                  <h5>{totalScore}</h5>
                </div>
                <div
                  className="card fw-medium text-center"
                  style={{ width: "200px", minHeight: '155px' }}
                >
                  Ka.Prodi/Ka.Dept
                  <hr />
                  <h5>{0}</h5>
                </div>
                <div
                  className="card fw-medium text-center"
                  style={{ width: "200px", minHeight: '155px' }}
                >
                  WaDIR/DIR
                  <hr />
                  <h5>{0}</h5>
                </div>
              </div>
            </div>
          </TabScoring>
        );
      })}
    </Box>
  );
}
